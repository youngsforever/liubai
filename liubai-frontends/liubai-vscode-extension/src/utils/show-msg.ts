import { i18n } from "~/locales/i18n"
import type { LiuErrReturn } from "~/types"
import * as vscode from 'vscode';

export async function showErrMsg(
  theType: "login" | "other",
  res: LiuErrReturn,
) {
  // 1. get params
  const { code, errMsg, showMsg } = res

  // 2. handle content
  let content_key = "tip.try_again_later"
  let content_opt: Record<string, string> | undefined
  if(showMsg) {
    content_key = "tip.err_2"
    content_opt = { errMsg: showMsg, code }
  }
  else if(errMsg) {
    content_key = "tip.err_2"
    content_opt = { errMsg, code }
  }

  // 3. handle title
  let title_key = "tip.unknown_err"
  if(theType === "login") {
    title_key = "login.err"
  }

  // 4. message
  let msg = i18n.t(title_key)
  msg += i18n.t(content_key, content_opt)

  // 5. handle customer service link
  const customerService = LIU_ENV.CUSTOMER_SERVICE
  const devEmail = LIU_ENV.DEVELOPER_EMAIL
  let link: string | undefined
  if(customerService) {
    link = customerService
  }
  else if(devEmail) {
    link = `mailto:${devEmail}`
  }

  // 6. show without link
  if(!link) {
    vscode.window.showWarningMessage(msg)
    return true
  }

  // 7. show with link
  const contactUs = i18n.t("tip.contact_us")
  const cancelTxt = i18n.t("common.cancel")
  const w = vscode.window
  const res1 = await w.showWarningMessage(msg, contactUs, cancelTxt)
  if(res1 === contactUs) {
    const externalUri = vscode.Uri.parse(link)
    vscode.env.openExternal(externalUri)
  }
  
  return true
}