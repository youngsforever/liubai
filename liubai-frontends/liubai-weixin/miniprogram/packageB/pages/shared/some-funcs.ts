import APIs from "~/packageB/requests/APIs"
import { LiuReq } from "~/packageB/requests/LiuReq"
import type { SubmitTaskDateTime } from "~/packageB/types/types-task"
import { LiuUtil } from "~/packageB/utils/liu-util/index"
import { LiuApi } from "~/packageB/utils/LiuApi"
import { LiuTime } from "~/packageB/utils/LiuTime"
import { Loginer } from "~/packageB/utils/login/Loginer"

let lastCheckNameStamp = 0

export function checkNameExisted() {
  // 1. check out frequency
  const inOneMinute = LiuTime.isWithinMillis(lastCheckNameStamp, LiuTime.MINUTE)
  if(inOneMinute) return true
  lastCheckNameStamp = LiuTime.getTime()

  // 2. check nickname
  const loginData = Loginer.getLoginDataSync()
  if (!loginData?.nickname) {
    LiuApi.navigateTo({
      url: "/packageB/pages/article/article?key=wxmini-login",
    })
    return false
  }
  return true
}

export async function toFetchTaskDateTime(
  id: string,
  data: SubmitTaskDateTime,
) {
  const w2 = {
    operateType: "update-task-time",
    id,
    ...data,
  }
  const url2 = APIs.PPL_TASKS
  const res2 = await LiuReq.request(url2, w2)
  if(res2.code === "0000") {
    LiuUtil.showCustomToast({
      title_key: "task-detail.updated",
      icon: "success",
    })
  }
}