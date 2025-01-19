import type { LiuAuthStatus, LiuRqOpt, LiuRqReturn } from "~/types";
import { handleAfterFetching, handleBeforeFetching } from "./tools/req-funcs";
import * as vscode from "vscode"
import liuInfo from "~/utils/liu-info";
import time from "~/utils/basic/time";
import valTool from "~/utils/basic/val-tool";
import typeCheck from "~/utils/basic/type-check";

let authStatus: LiuAuthStatus | undefined
function setAuthStatus(data: LiuAuthStatus) {
  authStatus = data
}

async function _getBody<U extends Record<string, any>>(
  body?: U,
) {
  // 1. encrypto some data in body
  if(body && authStatus?.client_key) {
    await handleBeforeFetching(body, authStatus.client_key)
  }

  // 2. add some common data
  const info = liuInfo.getInfo()
  const b2: Record<string, any> = {
    x_liu_language: vscode.env.language,
    x_liu_theme: "dark",
    x_liu_version: info.extensionVersion,
    x_liu_stamp: time.getTime(),
    x_liu_timezone: time.getTimezone().toFixed(1),
    x_liu_client: "ide-extension",
    x_liu_device: info.deviceStr,
    x_liu_ide_type: info.ideType,
    x_liu_machine_id: info.machineId,
    ...body,
  }
  if(authStatus) {
    b2["x_liu_token"] = authStatus.token
    b2["x_liu_serial"] = authStatus.serial
  }

  const str = valTool.objToStr(b2)
  return str
}

async function request<
  T extends Record<string, any>,
  U extends Record<string, any> = Record<string, any>,
>(
  url: string,
  body?: U,
  opt?: LiuRqOpt,
) {
  const b = await _getBody(body)
  let init: RequestInit = {
    method: opt?.method ?? "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: b,
  }

  if(opt?.signal) {
    init.signal = opt.signal
  }

  let res: Response
  try {
    res = await fetch(url, init)
  }
  catch(err: any) {
    console.warn("fetch err...........")
    console.log(err)
    console.log(" ")

    const errMsg: unknown = err.toString?.()
    const errName = err.name
    let errMsg2 = ""  // 转成小写的 errMsg

    if(typeCheck.isString(errMsg)) {
      errMsg2 = errMsg.toLowerCase()
    }

    if(errName === "TimeoutError") {
      return { code: "F0002" }
    }
    if(errName === "AbortError") {
      return { code: "F0003" }
    }
    if(errName === "TypeError") {

      // 当后端整个 Shut Down 时，可能抛出这个错误
      // 欠费时，也可能抛出这个错误
      if(errMsg2.includes("failed to fetch")) {
        return { code: "B0001" }
      }
      
    }

    return { code: "C0001" }
  }

  if(!res) {
    console.warn("liu-req fail: ")
    console.log(res)
    console.log(" ")
    return { code: "C0001" }
  }

  const status = res.status

  // Laf 底层异常
  if(status === 500) {
    return { code: "B0500" }
  }
  // 其他错误皆视为后端在维护中
  if(status > 500 && status < 600) {
    return { code: `B0001` }
  }

  let res2 = await res.json() as LiuRqReturn<T>

  if(res2.data && authStatus) {
    const newData = await handleAfterFetching(res2.data, authStatus.client_key)
    if(!newData) {
      return { code: "E4009", errMsg: "decrypt error on local client" }
    }
    res2.data = newData
  }

  return res2
}

export default {
  setAuthStatus,
  request,
}