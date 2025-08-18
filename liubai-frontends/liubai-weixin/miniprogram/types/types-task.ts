import type { PeopleTasksAPI } from "~/requests/req-types";

export interface TaskItem extends PeopleTasksAPI.WxTaskItem {
  allDone?: boolean
  doneCount?: number
  eachOtherDone?: boolean
  openidFromSingleChat?: string  // 在列表上，显示来自哪个单聊的那个人的 group_openid
}