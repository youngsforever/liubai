import { ImageHelper } from "~/packageA/utils/ImageHelper";
import { LiuTunnel } from "~/utils/LiuTunnel";


export async function useCsOnLoad() {
  console.log("useCsOnLoad..............")
  const res1 = await getImageFromTunnel()
  console.log("useCsOnLoad res1: ", res1)

}

// get the image from the index page
async function getImageFromTunnel() {
  const res1 = await LiuTunnel.takeStuff<WechatMiniprogram.MediaFile>("coupon-search-image")
  if(!res1) return

  const imgHelper = new ImageHelper(res1)
  const res2 = await imgHelper.run()

  return res2
}

// https://developers.weixin.qq.com/miniprogram/dev/framework/material/support_material.html
async function getImageFromChatMaterial() {
  
}