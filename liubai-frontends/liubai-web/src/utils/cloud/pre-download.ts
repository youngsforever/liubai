// 预下载 (pre-download) 用户的云端数据到本地。
//
// 两种加载方向：
//   - CREATE_FIRST: 按 createdStamp 倒序回填历史数据 (新设备首次登录)
//   - EDIT_FIRST:   按 editedStamp 倒序同步最近编辑 (日常打开，有上界)
//
// 节流：
//   - 每次请求之间至少 2s (服务端限流要求)
//   - 再叠加 requestIdleCallback (浏览器闲下来才跑，不抢主线程)
//
// Checkpoint：
//   - 每成功加载一批都存进 localCache
//   - 到 MAX_STEPS 还没完 / 网络失败 / 关页面 → checkpoint 保留
//   - 下次打开 App / 切回 tab / useThreadList 触发时 → resume

import { watch } from "vue"
import type { SyncGet_ContentList } from "~/types/cloud/sync-get/types"
import time from "~/utils/basic/time"
import valTool from "~/utils/basic/val-tool"
import { CloudMerger } from "./CloudMerger"
import localCache from "~/utils/system/local-cache"
import { useDocumentVisibility } from "~/hooks/useVueUse"

export type PreDownloadLoadType = "CREATE_FIRST" | "EDIT_FIRST"

export interface PreDownloadCheckpoint {
  spaceId: string
  loadType: PreDownloadLoadType
  lastItemStamp?: number
  // 仅 EDIT_FIRST 使用：此次 run 开始时的上界，resume 时要沿用
  lastLoadEditStamp?: number
}

const MAX_STEPS: Record<PreDownloadLoadType, number> = {
  // 新设备首次登录要回填全部历史，一轮 9 条
  // 500 轮 = 4500 条，覆盖绝大多数用户；保险栓防止 bug 导致死循环
  CREATE_FIRST: 500,
  // 日常场景有 lastLoadEditStamp 上界，自然收敛，20 次够用
  EDIT_FIRST: 20,
}
const BATCH_SIZE = 9
const REQ_INTERVAL = 2000   // 服务端限流下限 (ms)
const IDLE_TIMEOUT = 3000   // requestIdleCallback 超时上限 (ms)

let isRunning = false

function saveCheckpoint(cp: PreDownloadCheckpoint) {
  localCache.setPreference("preDownloadCheckpoint", cp)
}

function clearCheckpoint() {
  localCache.setPreference("preDownloadCheckpoint", undefined)
}

function loadCheckpoint(): PreDownloadCheckpoint | undefined {
  return localCache.getPreference().preDownloadCheckpoint
}

// 等下一轮可以发请求：2s 硬下限 + idle (有就等，没有就算)
async function waitForNext() {
  await valTool.waitMilli(REQ_INTERVAL)
  if (typeof requestIdleCallback === "undefined") return
  await new Promise<void>(resolve => {
    requestIdleCallback(() => resolve(), { timeout: IDLE_TIMEOUT })
  })
}

async function runLoop(cp: PreDownloadCheckpoint) {
  isRunning = true

  const maxSteps = MAX_STEPS[cp.loadType]
  // 初次进 loop (非 resume) 才在第一步设 loadEditStamp
  const isFreshRun = cp.lastItemStamp === undefined
  let stepCount = 0

  try {
    while (stepCount < maxSteps) {
      stepCount++
      await waitForNext()

      const arg: SyncGet_ContentList = {
        taskType: "content_list",
        spaceId: cp.spaceId,
        loadType: cp.loadType,
      }
      if (cp.lastItemStamp) arg.lastItemStamp = cp.lastItemStamp

      const parcels = await CloudMerger.request(arg)

      // 网络/服务端失败：保留 checkpoint，停下，等下次 resume
      if (!parcels) return

      // 首次 EDIT_FIRST 的第一步标记 loadEditStamp (resume 时不覆盖)
      if (
        cp.loadType === "EDIT_FIRST"
        && stepCount === 1
        && isFreshRun
      ) {
        localCache.setPreference("loadEditStamp", time.getTime())
      }

      // 少于一批 = 加载到底了
      if (parcels.length < BATCH_SIZE) {
        clearCheckpoint()
        return
      }

      // 取下一个 lastItemStamp
      const lastParcel = parcels[parcels.length - 1]
      let newStamp: number | undefined
      if (lastParcel?.parcelType === "content") {
        newStamp = cp.loadType === "CREATE_FIRST"
          ? lastParcel.content?.createdStamp
          : lastParcel.content?.editedStamp
      }
      if (!newStamp) {
        clearCheckpoint()
        return
      }

      cp.lastItemStamp = newStamp

      // EDIT_FIRST 命中上界
      if (
        cp.loadType === "EDIT_FIRST"
        && cp.lastLoadEditStamp
        && cp.lastLoadEditStamp > newStamp
      ) {
        clearCheckpoint()
        return
      }

      // 持久化进度 (下次 resume 从这里继续)
      saveCheckpoint(cp)
    }

    // 到 session 上限：checkpoint 保留，下次打开 App 会 resume
  } finally {
    isRunning = false
  }
}

/**
 * 触发 pre-download。
 * 如果已有同 spaceId 的 checkpoint → resume；否则 fresh start。
 * spaceId 不匹配的旧 checkpoint 会被清掉。
 */
export function preDownloadStart(
  spaceId: string,
  loadType: PreDownloadLoadType,
  lastLoadEditStamp?: number,
) {
  if (isRunning) return

  const existing = loadCheckpoint()
  if (existing) {
    if (existing.spaceId === spaceId) {
      runLoop(existing)
      return
    }
    clearCheckpoint()
  }

  const cp: PreDownloadCheckpoint = {
    spaceId,
    loadType,
    lastItemStamp: undefined,
    lastLoadEditStamp: loadType === "EDIT_FIRST" ? lastLoadEditStamp : undefined,
  }
  saveCheckpoint(cp)
  runLoop(cp)
}

/**
 * 有未完成的 checkpoint 就 resume。
 * 被 init-cycle (App 启动) 和 visibilitychange (切回 tab) 调用。
 */
export function preDownloadResume() {
  if (isRunning) return
  const cp = loadCheckpoint()
  if (!cp) return
  runLoop(cp)
}

/**
 * 注册 "tab 切回前台 → resume" 的监听。
 * 必须在 setup 上下文中调用一次 (由 initCycle 负责)。
 */
export function setupPreDownload() {
  const visibility = useDocumentVisibility()
  watch(visibility, (v) => {
    if (v === "visible") preDownloadResume()
  })
}
