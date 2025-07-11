import { LiuReq } from "../../requests/LiuReq"
import APIs from "../../requests/APIs"
import { LiuApi } from "../../utils/LiuApi"
import { LiuApp } from "../../utils/usePackageB"
import { LiuUtil } from "../../utils/liu-util/index"
import type { WxMiniAPI } from "../../types/types-wx"
import type { PeopleTasksAPI } from "~/packageB/requests/req-types"

export class TaskManager {

  static chatInfo: WxMiniAPI.ChatInfo | null = null

  static async init() {
    if(this.chatInfo) return true

    // 1. login first
    const res1 = await LiuApp.autoLogin()
    if(!res1) return

    // 2. get chat tool info which is encrypted
    const res2 = await LiuApi.getChatToolInfo()
    if(!res2) {
      await LiuUtil.showCustomModal({
        content: "fail to get chat tool info",
        showCancel: false,
      })
      LiuUtil.goHome()
      return
    }

    // 3. fetch chat tool info
    const url3 = APIs.PPL_TASKS
    const u3 = {
      operateType: "enter-wx-chat-tool",
      wxData: res2,
    }
    const res3 = await LiuReq.request<PeopleTasksAPI.Res_EnterWxChatTool>(
      url3, u3
    )
    console.log("TaskManager res3: ", res3)
    if(res3.code === "0000" && res3.data) {
      this.chatInfo = res3.data.chatInfo
    }

    return true
  }


}
