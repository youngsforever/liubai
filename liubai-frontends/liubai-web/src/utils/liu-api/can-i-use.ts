import { isPrefersReducedMotion } from "./device"
import { getCharacteristic } from "./characteristic"
import valTool from "../basic/val-tool"
import liuEnv from "../liu-env"
import type { LiuYorN } from "~/types/types-basic"

function isSafeBrowser() {
  if (typeof window === "undefined") return false
  const _sub = window.crypto?.subtle
  const hasBackend = liuEnv.hasBackend()
  if (typeof _sub === "undefined" && hasBackend) return false
  return true
}


function viewTransitionApi() {
  const res1 = isPrefersReducedMotion()
  if (res1) return false

  const hasViewTransition = Boolean(document.startViewTransition)

  return hasViewTransition
}

function abortSignalTimeout() {
  if (typeof AbortSignal === "undefined") return false
  if (typeof AbortSignal.timeout === "undefined") return false
  return true
}

/** Using CSS to detect text overflow
 *  https://juejin.cn/post/7347221074704777226
 *  tech stacks:
 *    CSS at-rule: @container: Style queries
 *      see: https://developer.mozilla.org/en-US/docs/Web/CSS/@container#browser_compatibility
 *    CSS property: animation-timeline: scroll()
 *      see: https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline#browser_compatibility
 */
function cssDetectTextOverflow() {
  const cha = getCharacteristic()
  if (!cha.isChrome || !cha.browserVersion) return false
  const res = valTool.compareVersion(cha.browserVersion, "115.0.0")
  return res >= 0
}

// see: https://developers.google.com/identity/gsi/web/guides/fedcm-migration#before_you_begin
// & https://developer.mozilla.org/en-US/docs/Web/API/FedCM_API#browser_compatibility
function fedCM() {
  const cha = getCharacteristic()
  const { isChrome, browserVersion } = cha

  if (isChrome && browserVersion) {
    const res1 = valTool.compareVersion(browserVersion, "117.0.0")
    return res1 >= 0
  }

  return false
}

function isRunningStandalone() {
  //@ts-expect-error Property only exists on Safari
  const standalone = window.navigator.standalone
  if (typeof standalone === "boolean") {
    return standalone
  }

  try {
    const res = window.matchMedia('(display-mode: standalone)').matches
    return res
  }
  catch (err) {
    console.warn("fail to call window.matchMedia('(display-mode: standalone)').matches")
    console.log(err)
  }

  return false
}


async function hasInstalledPWA(): Promise<LiuYorN> {
  const res1 = isRunningStandalone()
  if (res1) return "Y"

  const { isSafari } = getCharacteristic()
  if (isSafari) {
    return "N"
  }

  const res2 = "getInstalledRelatedApps" in navigator
  if (!res2) {
    console.warn("navigator.getInstalledRelatedApps is not supported")
    return "U"
  }

  // console.log("to call getInstalledRelatedApps............")

  const d1 = Date.now()
  //@ts-expect-error getInstalledRelatedApps is undefined
  const relatedApps = await navigator.getInstalledRelatedApps()
  const d2 = Date.now()

  // sometimes it consumes too much, like 32s
  // console.log(`getInstalledRelatedApps 耗时: ${d2 - d1} ms`)
  // console.log(relatedApps)
  // console.table(relatedApps)

  if (relatedApps.length > 0) return "Y"
  return "N"
}

function canAddToHomeScreenInSafari() {
  const {
    isSafari,
    isInWebView,
    browserVersion,
    isMobile,
  } = getCharacteristic()
  if (isInWebView) return
  if (!isSafari) return
  if (!browserVersion) return

  // for PC
  const res1 = valTool.compareVersion(browserVersion, "17.0")
  if (res1 >= 0) return true

  // for mobile
  if (!isMobile) return false
  const res2 = valTool.compareVersion(browserVersion, "14.0")
  return res2 >= 0
}

// reference: https://web.dev/patterns/files/open-one-or-multiple-files
function fileSystemAccessAPI() {
  const supportsFileSystemAccess =
    "showOpenFilePicker" in window &&
    (() => {
      try {
        return window.self === window.top;
      } catch {
        return false;
      }
    })();

  return supportsFileSystemAccess
}


function webPush() {
  const res1 = "Notification" in window
  if (!res1) {
    return false
  }
  if (typeof Notification.requestPermission !== "function") {
    return false
  }

  const cha = getCharacteristic()
  const browserVersion = cha.browserVersion
  if (!browserVersion) return false

  // for iOS and iPadOS
  if (cha.isIOS || cha.isIPadOS) {
    // https://caniuse.com/?search=PushManager
    const isBiggerThan16_4 = valTool.compareVersion(browserVersion, "16.4")
    if (isBiggerThan16_4 >= 0 && isRunningStandalone()) {
      return true
    }
    return false
  }

  // for macOS
  if (cha.isMac) {
    // https://caniuse.com/?search=PushManager
    const isBiggerThan16_0 = valTool.compareVersion(browserVersion, "16.0")
    return isBiggerThan16_0 >= 0
  }

  // 是否在 super app 里头
  if (cha.isInWebView) {
    return false
  }

  const hasServiceWorker = "serviceWorker" in navigator
  return hasServiceWorker
}

function declarativeWebPush() {
  const cha = getCharacteristic()
  const browserVersion = cha.browserVersion
  if (!browserVersion) return false

  // for iOS and iPadOS
  if (cha.isIOS || cha.isIPadOS) {
    // see: https://developer.apple.com/videos/play/wwdc2025/235/
    const isBiggerThan18_4 = valTool.compareVersion(browserVersion, "18.4")
    if (isBiggerThan18_4 >= 0 && isRunningStandalone()) {
      return true
    }
    return false
  }

  // for macOS
  if (cha.isMac) {
    // see: https://developer.apple.com/videos/play/wwdc2025/235/
    const isBiggerThan18_5 = valTool.compareVersion(browserVersion, "18.5")
    return isBiggerThan18_5 >= 0
  }

  return false
}

function geolocation() {
  if (typeof window === "undefined") return false
  const res = "geolocation" in navigator
  return res
}


export default {
  fileSystemAccessAPI,
  isSafeBrowser,
  viewTransitionApi,
  cssDetectTextOverflow,
  abortSignalTimeout,
  fedCM,
  isRunningStandalone,
  hasInstalledPWA,
  canAddToHomeScreenInSafari,
  webPush,
  declarativeWebPush,
  geolocation,
}