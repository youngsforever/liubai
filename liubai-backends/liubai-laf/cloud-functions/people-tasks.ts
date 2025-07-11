
// Function Name: people-tasks
import cloud from "@lafjs/cloud"
import { checker, verifyToken, WxMiniHandler } from "@/common-util"
import { 
  type LiuRqReturn, 
  type VerifyTokenRes_B,
  type PeopleTasksAPI,
  WxMiniAPI, 
} from "@/common-types"
import * as vbot from "valibot"

const db = cloud.database()
const _ = db.command

export async function main(ctx: FunctionContext) {

  // 1. verify
  const body = ctx.request?.body ?? {}
  const vRes = await verifyToken(ctx, body)
  if(!vRes.pass) return vRes.rqReturn

  // 2. decide which path to go
  let res: LiuRqReturn = { code: "E4000" }
  const oT = body["operateType"] as PeopleTasksAPI.OperateType
  if(oT === "enter-wx-chat-tool") {
    res = await enter_wx_chat_tool(body, vRes)
  }

  return res
}


async function enter_wx_chat_tool(
  body: Record<string, any>,
  vRes: VerifyTokenRes_B,
) {
  // 1. check out wxData
  const wxData = body.wxData
  const res1 = vbot.safeParse(WxMiniAPI.Sch_EncryptedAtom, wxData)
  if(!res1.success) {
    const errMsg = checker.getErrMsgFromIssues(res1.issues)
    return { code: "E4000", errMsg }
  }
  const encryptedData = wxData.encryptedData
  const iv = wxData.iv

  // 2. get required params
  const session_key = vRes.userData.thirdData?.wx_mini?.session_key
  const appid = process.env.LIU_WX_MINI_APPID
  if(!session_key || !appid) {
    return { code: "E5001", errMsg: "no session_key or appid" }
  }

  // 3. decrypt wxData
  const res3 = WxMiniHandler.decryptUserData<WxMiniAPI.ChatInfo>(
    appid, session_key, encryptedData, iv
  )
  if(!res3) {
    return { code: "E5001", errMsg: "fail to decrypt wxData" }
  }
  const result: PeopleTasksAPI.Res_EnterWxChatTool = {
    operateType: "enter-wx-chat-tool",
    chatInfo: res3,
  }

  return { code: "0000", data: result }
}