import { reactive, watch } from "vue"
import type { CwData } from "./types"
import liuEnv from "~/utils/liu-env"
import { 
  type RouteAndLiuRouter, 
  useRouteAndLiuRouter,
} from "~/routes/liu-router"
import type { Res_OC_GetFeishu } from "~/requests/req-types"
import { pageStates } from "~/utils/atom"
import { useAwakeNum } from "~/hooks/useCommon"
import { useWorkspaceStore } from "~/hooks/stores/useWorkspaceStore"
import APIs from "~/requests/APIs"
import liuReq from "~/requests/liu-req"
import { useDebounceFn, useThrottleFn } from "~/hooks/useVueUse"
import { showErrMsg } from "~/pages/level1/tools/show-msg"
import cui from "~/components/custom-ui"
import time from "~/utils/basic/time"

let lastUserInputStamp = 0

export function useConnectFeishu() {
  const hasBE = liuEnv.hasBackend()
  const rr = useRouteAndLiuRouter()

  const cwData = reactive<CwData>({
    pageState: hasBE ? pageStates.LOADING : pageStates.NEED_BACKEND,
    backup_toggle: false,
    canSave: false,
    isSaving: false,
    original_personal_base_token: "",
    original_base_id: "",
    original_table_id: "",
  })

  const { awakeNum, syncNum } = useAwakeNum()
  watch(awakeNum, (newV) => {
    if(newV < 1) return
    if(syncNum.value < 1) return
    if(!hasBE) return
    checkoutData(cwData, rr)
  }, { immediate: true })

  const onBackupChanged = useThrottleFn((newV: boolean) => {
    toChangeBackup(cwData, newV)
  }, 400)

  const onBackupInput = useDebounceFn(() => {
    lastUserInputStamp = time.getTime()
    const oldV1 = cwData.original_personal_base_token
    const oldV2 = cwData.original_base_id
    const oldV3 = cwData.original_table_id
    const newV1 = cwData.personal_base_token ?? ""
    const newV2 = cwData.base_id ?? ""
    const newV3 = cwData.table_id ?? ""
    const isDifferent = Boolean(oldV1 !== newV1 || oldV2 !== newV2 || oldV3 !== newV3)
    cwData.canSave = isDifferent
  }, 100)

  const onTapConfigMethod = () => {
    const link = "https://docs.liubai.cc/guide/connect/feishu"
    window.open(link, "_blank")
  }
  
  return {
    cwData,
    onBackupChanged,
    onBackupInput,
    onTapSave: () => toSave(cwData),
    onTapConfigMethod,
  }
}

async function toSave(
  cwData: CwData,
) {
  if(!cwData.canSave) return
  if(cwData.isSaving) return

  // 1. get member id
  const wStore = useWorkspaceStore()
  const memberId = wStore.memberId
  if(!memberId) return

  // 2.1 check out personal_base_token
  const tmp_token1 = cwData.personal_base_token ?? ""
  const personal_base_token = tmp_token1.trim()
  if(personal_base_token) {
    const res1 = personal_base_token.length >= 20 && personal_base_token.startsWith("pt")
    if(!res1) {
      cwData.canSave = false
      showNotGood("connect.feishu_personalBaseToken_err")
      return
    }
  }

  // 2.2 check out base id
  const tmp_base_id = cwData.base_id ?? ""
  const base_id = tmp_base_id.trim()
  if(base_id) {
    const res1 = base_id.length >= 10
    if(!res1) {
      cwData.canSave = false
      showNotGood("connect.feishu_base_id_err")
      return
    }
  }

  // 2.3 check out table id
  const tmp_table_id = cwData.table_id ?? ""
  const table_id = tmp_table_id.trim()
  if(table_id) {
    const res1 = table_id.length >= 10 && table_id.startsWith("tb")
    if(!res1) {
      cwData.canSave = false
      showNotGood("connect.feishu_table_id_err")
      return
    }
  }

  // 3. construct query
  const url3 = APIs.OPEN_CONNECT
  const q3 = {
    operateType: "set-feishu",
    memberId,
    enable: "Y",
    plz_enc_personal_base_token: personal_base_token,
    plz_enc_base_id: base_id,
    plz_enc_table_id: table_id,
  }
  lastUserInputStamp = time.getTime()
  cwData.isSaving = true
  const res3 = await liuReq.request(url3, q3)
  cwData.isSaving = false
  
  // 4. handle result
  const code4 = res3.code
  if(code4 !== "0000") {
    showErrMsg("other", res3)
    return
  }
  cwData.original_personal_base_token = personal_base_token
  cwData.original_base_id = base_id
  cwData.original_table_id = table_id
  cwData.canSave = false
  cui.showSnackBar({ text_key: "common.saved" })
}

async function toChangeBackup(
  cwData: CwData,
  newVal: boolean,
) {
  cwData.backup_toggle = newVal

  // 1. get member id
  const wStore = useWorkspaceStore()
  const memberId = wStore.memberId
  if(!memberId) return

  // 2. construct query
  const data2 = {
    operateType: "set-feishu",
    memberId,
    enable: newVal ? "Y" : "N",
  }
  lastUserInputStamp = time.getTime()
  const url2 = APIs.OPEN_CONNECT
  const res2 = await liuReq.request(url2, data2)
  
  // 3. handle result
  const code3 = res2.code
  if(code3 !== "0000") {
    cwData.backup_toggle = !newVal
    showErrMsg("other", res2)
    return
  }

  if(newVal && cwData.personal_base_token && cwData.base_id && cwData.table_id) {
    cui.showSnackBar({ text_key: "common.opened" })
  }
  else if(!newVal) {
    cui.showSnackBar({ text_key: "common.closed" })
  }
}


function showNotGood(content_key: string) {
  cui.showModal({
    title: "🤔",
    content_key,
    isTitleEqualToEmoji: true,
    showCancel: false,
  })
}

async function checkoutData(
  cwData: CwData,
  rr: RouteAndLiuRouter,
) {

  // 1. get member id
  const wStore = useWorkspaceStore()
  const memberId = wStore.memberId
  if(!memberId) return

  // 2. fetch data
  const url2 = APIs.OPEN_CONNECT
  const w2 = {
    operateType: "get-feishu",
    memberId,
  }
  const res2 = await liuReq.request<Res_OC_GetFeishu>(url2, w2)

  // 3. handle data
  const code3 = res2.code
  const data3 = res2.data

  // 4. handle response
  if(code3 === "E4003") {
    cwData.pageState = pageStates.NO_AUTH
  }
  else if(code3 === "E4004") {
    cwData.pageState = pageStates.NO_DATA
  }
  else if(code3 === "0000") {
    cwData.pageState = pageStates.OK
  }
  else {
    cwData.pageState = pageStates.NETWORK_ERR
  }

  // 5. handle some required data
  if(code3 !== "0000" || !data3) return
  if(time.isWithinMillis(lastUserInputStamp, 1000)) return
  cwData.backup_toggle = Boolean(data3.enable === "Y")

  const new_personal_base_token = data3.personal_base_token ?? ""
  if(new_personal_base_token !== cwData.original_personal_base_token) {
    cwData.personal_base_token = new_personal_base_token
    cwData.original_personal_base_token = new_personal_base_token
  }

  const new_base_id = data3.base_id ?? ""
  if(new_base_id !== cwData.original_base_id) {
    cwData.base_id = new_base_id
    cwData.original_base_id = new_base_id
  }

  const new_table_id = data3.table_id ?? ""
  if(new_table_id !== cwData.original_table_id) {
    cwData.table_id = new_table_id
    cwData.original_table_id = new_table_id
  }
}