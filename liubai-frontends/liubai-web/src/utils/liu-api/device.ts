import type { SupportedTheme } from "~/types/types-atom"
import type { SupportedLocale } from "~/types/types-locale"
import { isSupportedLocale } from '~/types/types-locale'
import time from "../basic/time"

type ResolveReject = (res: boolean | undefined) => void
export interface BatteryManager extends EventTarget {
  charging: boolean
  chargingTime: number
  dischargingTime: number
  level: number
}

const copyToClipboard = (text: string) => {

  // 方法2: 使用 navigator.clipboard
  const _fun2 = async (a: ResolveReject, b: ResolveReject, text: string) => {
    let res = false
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      res = true
    }

    a(res)
  }

  // 方法1: 创建 textarea 复制
  const _fun1 = (a: ResolveReject, b: ResolveReject, text: string) => {
    const element = document.createElement('textarea')
    document.body.appendChild(element)
    element.value = text
    element.select()
    if (document.execCommand('copy')) {
      document.body.removeChild(element)
      a(true)
      return
    }
    document.body.removeChild(element)
    _fun2(a, b, text)
  }

  // 判断使用哪个方法
  const _t = (a: ResolveReject, b: ResolveReject) => {
    if (!text) {
      console.warn(`没有内容要剪贴.....`)
      a(false)
      return
    }

    if (text.length > 500) {
      _fun2(a, b, text)
    }
    else {
      _fun1(a, b, text)
    }
  }

  return new Promise(_t)
}

// Simulate vibration on iOS
// @reference: https://github.com/tijnjh/ios-haptics/blob/main/src/index.ts
const _vibrateFallback = () => {
  const labelEl = document.createElement("label");
  labelEl.ariaHidden = "true";
  labelEl.style.display = "none";

  const inputEl = document.createElement("input");
  inputEl.type = "checkbox";
  inputEl.setAttribute("switch", "");
  labelEl.appendChild(inputEl);

  document.head.appendChild(labelEl);
  labelEl.click();
  setTimeout(() => {
    labelEl.remove();
    inputEl.remove();
  }, 500);
}


const vibrate = (pattern: VibratePattern) => {
  if (!navigator || !('vibrate' in navigator)) {
    _vibrateFallback()
    return false
  }

  let res: boolean
  try {
    res = navigator.vibrate(pattern)
  }
  catch (err) {
    console.log("vibrate err: ")
    console.log(err)
    return false
  }
  return res
}

const getBattery = async () => {
  if (!navigator || !('getBattery' in navigator)) {
    return false
  }

  //@ts-expect-error
  const res = await navigator.getBattery() as BatteryManager
  return res
}

// 从浏览器获取当前主题
function getThemeFromSystem(): SupportedTheme {
  const m = window.matchMedia('(prefers-color-scheme: dark)')
  const isDarkWhenInit = m.matches
  if (isDarkWhenInit) return "dark"
  return "light"
}

/**
 * 根据日期计算当天应该切换主题的时间点（日出和日落时间）
 * 
 * 1月1日：日出时间 7:00，日落时间 17:00
 * 7月1日：日出时间 5:00，日落时间 19:00
 * 在中间的日期，每天按照差值进行线性渐变过渡。
 * 
 * @param date 当前日期
 * @returns 
 * - sunrise: 日出时间点（在此时间点及之后、日落之前使用浅色模式），单位是“小时”的十进制数值（例如：6.5 代表早上 6:30）
 * - sunset: 日落时间点（在此时间点及之后、次日日出之前使用深色模式），单位是“小时”的十进制数值（例如：17.75 代表下午 5:45）
 */
export function getSunriseSunset(date: Date): { sunrise: number; sunset: number } {
  const year = date.getFullYear()
  const jan1Utc = Date.UTC(year, 0, 1)
  const jul1Utc = Date.UTC(year, 6, 1)
  const currentUtc = Date.UTC(year, date.getMonth(), date.getDate())

  let sunrise = 0
  let sunset = 0

  if (currentUtc < jul1Utc) {
    // 上半年：1月1日 -> 7月1日
    const totalDays = (jul1Utc - jan1Utc) / time.DAY
    const elapsedDays = (currentUtc - jan1Utc) / time.DAY
    const ratio = elapsedDays / totalDays

    // 日出：从 7 点渐变到 5 点
    sunrise = 7.0 - 2.0 * ratio
    // 日落：从 17 点渐变到 19 点
    sunset = 17.0 + 2.0 * ratio
  } else {
    // 下半年：7月1日 -> 下一年1月1日
    const jan1NextUtc = Date.UTC(year + 1, 0, 1)
    const totalDays = (jan1NextUtc - jul1Utc) / time.DAY
    const elapsedDays = (currentUtc - jul1Utc) / time.DAY
    const ratio = elapsedDays / totalDays

    // 日出：从 5 点渐变到 7 点
    sunrise = 5.0 + 2.0 * ratio
    // 日落：从 19 点渐变到 17 点
    sunset = 19.0 - 2.0 * ratio
  }

  // 针对特定城市的用户在东八区（UTC+8）下的偏差进行补偿
  const tz = time.getTimezone()
  if (tz === 8) {
    const iana = time.getTimezoneIANA()
    if (iana === "Asia/Urumqi") {
      sunrise += 2.0
      sunset += 2.0
    } else if (iana === "Asia/Chongqing") {
      sunrise += 1.0
      sunset += 1.0
    }
  }

  return { sunrise, sunset }
}

// 从当前时间判断要显示哪个主题
function getThemeFromTime(): SupportedTheme {
  const now = time.getTime()
  const date = new Date(now)
  const { sunrise, sunset } = getSunriseSunset(date)

  // 计算今天 0 点的时间戳
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  // 计算当前时间距离今天 0 点的毫秒数，并转换为十进制小时数
  const currentHour = (now - startOfDay) / time.HOUR

  if (currentHour >= sunrise && currentHour < sunset) return "light"
  return "dark"
}

export function isPrefersReducedMotion() {
  const res = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches
  return res
}

// 从浏览器获取当前支持的语言
function getLanguageFromSystem(): SupportedLocale {
  const lang = navigator.language
  if (isSupportedLocale(lang)) return lang

  const langs = navigator.languages
  for (let i = 0; i < langs.length; i++) {
    const aLang = langs[i]
    if (isSupportedLocale(aLang)) return aLang
    const _aLang = aLang.toLowerCase()
    if (_aLang === "zh-tw") return "zh-Hant"
    if (_aLang === "zh-hk") return "zh-Hant"
    if (_aLang === "zh-cn") return "zh-Hans"
    if (_aLang === "en-us") return "en"
  }

  // 判断 langs 是否有 zh
  if (langs.includes("zh")) return "zh-Hans"

  return "en"
}

// Badge API 设置小红点（当 web app 已被安装时才会生效）
// w3c: https://www.w3.org/TR/badging/
const setAppBadge = async (val?: number) => {
  const supported = "setAppBadge" in navigator
  if (!supported) return false

  const res = await navigator.setAppBadge(val)
  return res
}

// 清除小红点，clearAppBadge() 等效于 setAppBadge(0)
const clearAppBadge = async () => {
  const supported = "clearAppBadge" in navigator
  if (!supported) return false

  const res = await navigator.clearAppBadge()
  return res
}
// Geolocation API (extremely precise, requires user permission dialog)
const getLocation = (options?: PositionOptions): Promise<GeolocationPosition> => {
  const _wait = (a: (val: GeolocationPosition) => void, b: (err: any) => void) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        a(position);
      },
      (error) => {
        b(error);
      },
      {
        enableHighAccuracy: true,

        // 超时: 10 秒
        timeout: 10 * time.SECOND,

        // 缓存: 1 hr
        maximumAge: time.HOUR,
        ...options
      }
    );
  }

  return new Promise(_wait)
}


export default {
  copyToClipboard,
  vibrate,
  getBattery,
  getThemeFromSystem,
  getThemeFromTime,
  isPrefersReducedMotion,
  getLanguageFromSystem,
  setAppBadge,
  clearAppBadge,
  getLocation,
}