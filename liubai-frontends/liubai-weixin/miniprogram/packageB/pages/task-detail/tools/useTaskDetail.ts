import { LiuReq } from "~/packageB/requests/LiuReq";
import APIs from "../../../requests/APIs";
import type { WxMiniAPI } from "~/packageB/types/types-wx";
import type { PeopleTasksAPI } from "~/packageB/requests/req-types";
import type { TaskDetail } from "./types";
import { DateUtil } from "~/packageB/utils/date-util";
import valTool from "~/packageB/utils/val-tool";
import { LiuApi } from "~/packageB/utils/LiuApi";
import { ShowTip } from "~/packageB/utils/managers/ShowTip";
import { useI18n } from "~/packageB/locales/index";

export async function fetchTaskDetail(
  id: string,
  chatInfo: WxMiniAPI.ChatInfo,
) {
  const w1 = {
    operateType: "get-wx-task",
    id,
    chatInfo,
  }
  const url1 = APIs.PPL_TASKS
  const res1 = await LiuReq.request<PeopleTasksAPI.Res_GetWxTask>(url1, w1)
  return res1
}


export function showDetail(
  chatInfo: WxMiniAPI.ChatInfo,
  data: PeopleTasksAPI.Res_GetWxTask,
) {
  const assigneeList = data.assigneeList
  const postedTimeStr = DateUtil.showBasicTime(data.insertedStamp)

  // calculate some state
  const isMyTask = chatInfo.group_openid === data.owner_openid
  let hasAnyIncomplete = assigneeList.some(v => !v.doneStamp)
  let canIComplete = assigneeList.some(v => {
    if(v.group_openid === chatInfo.group_openid) {
      return !Boolean(v.doneStamp)
    }
    return false
  })
  
  // set detail
  const detail: TaskDetail = {
    desc: data.desc,
    owner_openid_list: [data.owner_openid],
    activity_id: data.activity_id,
    assigneeList,
    assignees: assigneeList.map(v => v.group_openid),
    insertedStamp: data.insertedStamp,
    editedStamp: data.editedStamp,
    endStamp: data.endStamp,
    closedStamp: data.closedStamp,
    postedTimeStr,
    isMyTask,
    hasAnyIncomplete,
    canIComplete,
  }
  return detail
}


export function toNotifyMembers(
  id: string,
  detail: TaskDetail,
) {
  const assigneeList = detail.assigneeList
  if(!assigneeList) return
  
  // 1. handle members
  const list1 = assigneeList.filter(v => !v.doneStamp)
  const members = list1.map(v => v.group_openid)
  if(members.length < 1) return
  console.log("members: ", members)

  // 2. handle title
  const desc = detail.desc
  const title = getNotifyTitle(detail.desc)
  if(!title) {
    toForward()
    return
  }
  const res2 = Math.abs(desc.length - title.length)
  if(res2 > 5 && title.length < 10) {
    toForward()
    return
  }
  
  console.log("getNotifyTitle result:", title)

  // 3. handle entrancePath
  const entrancePath = `/packageB/pages/task-detail/task-detail?id=${id}`

  // 4. to call notifyMembers
  LiuApi.notifyGroupMembers({
    title,
    members,
    entrancePath,
    type: "complete",
    success(res) {
      console.log("notifyGroupMembers success: ", res)
    },
    fail(err) {
      console.warn("notifyGroupMembers fail: ", err)
      const errMsg = err?.errMsg
      if(errMsg.includes("cancel")) return
      ShowTip.showErrMsg("提醒失败", err)
    }
  })
}

export async function toForward(
  justCreated = false,
) {
  const { t } = useI18n()
  const key = justCreated ? "task-detail.forward_1" : "task-detail.forward_2"
  const title = t(key)
  await LiuApi.shareAppMessageToGroup({ title })
}

function getNotifyTitle(desc: string) {
  desc = desc.trim()
  let title = ""
  let num = 0
  for(let i=0; i<desc.length; i++) {
    const char = desc[i]

    if(num >= 30) break

    // 1. for chinese
    const cnNum = valTool.getChineseCharNum(char)
    if(cnNum > 0) {
      if(valTool.isChinesePunctuation(char)) {
        console.warn("isChinesePunctuation: ", char)
        continue
      }
      num += 2
      title += char
      continue
    }

    // 2. for english
    if(valTool.isAllEnglishChar(char)) {
      num += 1
      title += char
      continue
    }

    // 3. for number
    if(valTool.isStringAsNumber(char)) {
      num += 1
      title += char
      continue
    }
    
  }

  return title
}