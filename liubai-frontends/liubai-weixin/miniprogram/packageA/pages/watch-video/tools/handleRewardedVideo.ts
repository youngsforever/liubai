import { LiuApi } from "~/utils/LiuApi"
import type { MiniProgramContext } from "~/types"
import { WatchVideoData } from "./types"
import { LiuUtil } from "~/utils/liu-util/index"
import { fetchPost } from "./useWatchVideo"

let rewardedVideoAd: WechatMiniprogram.RewardedVideoAd | undefined

export async function initRewardedVideoAd(
  ctx: MiniProgramContext<WatchVideoData>,
) {
  // 1. destroy first and get adUnitId
  destroyRewardedVideoAd()
  const adUnitId = ctx.data._adUnitId
  console.log("adUnitId: ", adUnitId)
  
  // 2. init and define callbacks
  rewardedVideoAd = LiuApi.createRewardedVideoAd({ adUnitId })
  rewardedVideoAd.onClose((res) => {
    console.log("rewardedVideoAd onClose: ", res)
    if(res.isEnded) {
      // 1. fetch
      fetchPost(ctx.data._credential)

      // 2. add num
      const {
        conversationToAd,
        conversationCountFromAd,
      } = ctx.data
      const bind = {
        conversationCountFromAd: conversationToAd + conversationCountFromAd,
      }
      ctx.setData(bind)
    }
    else {
      LiuUtil.showCustomModal({
        title: "👀",
        content_key: "watch-video.tip_1",
        showCancel: false,
      })
    }
  })

  rewardedVideoAd.onError((err) => {
    console.error("rewardedVideoAd onError: ", err)
    const errCode = err.errCode
    const errMsg = err.errMsg

    if(errCode === 1000) {
      LiuUtil.showCustomToast({ title_key: "shared.try_again_later" })
      return
    }

    LiuUtil.showCustomModal({
      title_key: "err.video_err",
      content_key: "err.err_reason",
      content_opt: { msg: errMsg, code: errCode },
      confirm_key: "shared.contact_us",
      success(res) {
        console.log("showCustomModal res: ")
        console.log(res)
      }
    })    
  })

  rewardedVideoAd.onLoad((res) => {
    console.log("rewardedVideoAd onLoad: ", res)
  })

  // 3. load
  const res3 = await rewardedVideoAd.load()
  console.log("rewardedVideoAd load res: ", res3)
}



export function destroyRewardedVideoAd() {
  if(!rewardedVideoAd) return
  rewardedVideoAd.destroy()
}


export async function showRewardedVideoAd() {
  if(!rewardedVideoAd) return
  const res = await rewardedVideoAd.show()
  console.log("showRewardedVideoAd res: ", res)
}