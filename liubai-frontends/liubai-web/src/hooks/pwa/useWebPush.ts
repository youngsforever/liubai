import liuApi from "~/utils/liu-api"

export type LiuPermission = "granted" | "denied" | "default" | "not_supported"

export function getWebPushPermission(): LiuPermission {
  const res1 = liuApi.canIUse.webPush()
  if(!res1) return "not_supported"

  const res2 = Notification.permission
  return res2
}

export async function requestWebPush() {
  console.log("requestWebPush......")
  const res1 = await Notification.requestPermission()
  console.log("requestWebPush: ", res1)
  return res1
}



export async function getWebPushSubscription() {
  console.log("getWebPushSubscription......")

  

  
}
