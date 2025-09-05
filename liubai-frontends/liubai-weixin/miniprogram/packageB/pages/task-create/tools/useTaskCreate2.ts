import APIs from "~/packageB/requests/APIs";
import { LiuReq } from "~/packageB/requests/LiuReq";
import type { PeopleTasksAPI } from "~/packageB/requests/req-types";
import { LiuTime } from "~/packageB/utils/LiuTime";
import { Loginer } from "~/packageB/utils/login/Loginer";
import valTool from "~/packageB/utils/val-tool";


export async function canIPostTask(
  fromOnLoad: boolean,
) {
  if(fromOnLoad) {
    await valTool.waitMilli(LiuTime.SECOND * 2)
  }
  const loginData = await Loginer.getLoginData()
  if(!loginData) return true

  const url1 = APIs.PPL_TASKS
  const param1 = {
    operateType: "can-i-post-task",
  }
  const res1 = await LiuReq.request<PeopleTasksAPI.Res_CanIPostTask>(url1, param1)
  console.log("canIPostTask res1: ", res1)

  const status = res1.data?.status
  if(status === "no") return false
  return true
}