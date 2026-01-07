import valTool from "~/utils/basic/val-tool"
import liuApi from "~/utils/liu-api"
import liuEnv from "~/utils/liu-env"

export type LiuPermission = "granted" | "denied" | "default" | "not_supported"

export function getWebPushPermission(): LiuPermission {
  const res1 = liuApi.canIUse.webPush()
  if (!res1) return "not_supported"

  const res2 = Notification.permission
  return res2
}

export async function requestWebPush() {
  console.log("requestWebPush......")
  const res1 = await Notification.requestPermission()
  console.log("requestWebPush: ", res1)
  return res1
}

function _getPushManager(
  reg: ServiceWorkerRegistration,
) {
  const declarativeWebPush = liuApi.canIUse.declarativeWebPush()

  if (declarativeWebPush) {
    if (typeof window.pushManager !== "undefined") {
      return window.pushManager
    }
  }

  return reg.pushManager
}




export async function getWebPushSubscription() {
  const reg = await navigator.serviceWorker.ready
  const pm = _getPushManager(reg)

  const _env = liuEnv.getEnv()
  const VAPID_PUBLIC_KEY = _env.VAPID_PUBLIC_KEY ?? ""
  const applicationServerKey = valTool.urlBase64ToUint8Array(VAPID_PUBLIC_KEY)

  try {
    console.time("pm.getSubscription")
    const sub = await pm.getSubscription()
    console.timeEnd("pm.getSubscription")
    console.log("sub1: ", sub)
    if (sub) return sub

    console.time("pm.subscribe")
    const sub2 = await pm.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    })
    console.timeEnd("pm.subscribe")
    console.log("sub2: ", sub2)
    return sub2
  }
  catch (err) {
    console.warn("getWebPushSubscription error: ", err)
  }

}
