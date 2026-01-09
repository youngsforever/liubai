import { getWebPushSubscription } from "~/hooks/pwa/useWebPush";
import time from "../basic/time";
import localCache from "../system/local-cache";



export async function handleWebPushSubscription(
  checkFrequency = true,
) {

  // 1. 根据缓存判断是否需要存储 web push subscription
  if (checkFrequency) {
    const onceData = localCache.getOnceData()
    const lastSaveWebPushStamp = onceData.lastSaveWebPushStamp ?? 0
    const isWithin = time.isWithinMillis(lastSaveWebPushStamp, time.WEEK)
    if (isWithin) return true
  }

  // 2. 获取 web push subscription
  const sub = await getWebPushSubscription()
  if (!sub) return false

  // 3. 去存储到远端
  const clientId = localCache.getClientId()
  const endpoint = sub.endpoint

  // ......


  // 4. 保存成功后，设置 lastSaveWebPushStamp
  localCache.setOnceData("lastSaveWebPushStamp", time.getTime())



}