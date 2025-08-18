import type { PeopleTasksAPI } from "~/requests/req-types";

export interface TaskCard extends PeopleTasksAPI.WxTaskItem {
  allDone?: boolean
  doneCount?: number
  eachOtherDone?: boolean

  // 在列表上，显示单聊里，除了我的另外一位的 group_openid
  openidFromSingleChat?: string
}