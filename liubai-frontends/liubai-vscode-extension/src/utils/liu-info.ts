import type { LiuIDEType, LiuInfo } from "../types"
import * as vscode from 'vscode'
import { getDeviceStrForWeb, getDeviceStrForNode } from "./tools/characteristic"
import typeCheck from "./basic/type-check"

let _info: LiuInfo

const getIdeType = (): LiuIDEType | undefined => {
  const _env = vscode.env
  const { appName, appHost } = _env

  if(appHost === "vscode.dev") return "vscode.dev"
  if(appHost === "github.dev") return "github.dev"
  if(appName === "Visual Studio Code") return "vscode"
  if(appName === "Visual Studio Code - Insiders") return "vscode-insiders"
  if(appName === "Cursor") return "cursor"
  if(appName === "Windsurf") return "windsurf"
  if(appName === "VSCodium") return "vscodium"
}

const _getDeviceData = (isWeb: boolean) => {
  let deviceStr: string | undefined
  let deviceName: string | undefined

  try {

    // for node
    if(!isWeb && typeof process !== "undefined") {
      deviceStr = getDeviceStrForNode()
      const os = require("os")
      const hostname = os.hostname()
      if(hostname && typeCheck.isString(hostname)) {
        deviceName = hostname
      }
    }

    // for web
    //@ts-expect-error: navigator
    if(isWeb && typeof navigator !== "undefined") {
      deviceStr = getDeviceStrForWeb()
    }
  }
  catch(err) {
    console.warn("_getDeviceData err: ")
    console.log(err)
  }

  return { deviceStr, deviceName }
}

/** more info please see: 
 *  https://code.visualstudio.com/api/advanced-topics/remote-extensions#varying-behaviors-when-running-remotely-or-in-the-codespaces-browser-editor
*/
const init = (context: vscode.ExtensionContext) => {
  const extensionId = context.extension.id
  const _env = vscode.env
  
  let ideType = getIdeType()
  if(!ideType) ideType = "vscode"

  const isDesktop = _env.uiKind === vscode.UIKind.Desktop
  const isWeb = _env.uiKind === vscode.UIKind.Web
  const evtVersion = LIU_ENV.EXT_VERSION
  const { deviceStr, deviceName } = _getDeviceData(isWeb)

  let machineId: string | undefined = _env.machineId
  let sessionId: string | undefined = _env.sessionId
  if(machineId === "someValue.machineId") machineId = undefined
  if(sessionId === "someValue.sessionId") sessionId = undefined
  
  _info = {
    ideType,
    isDesktop,
    isWeb,
    extensionId,
    ideVersion: vscode.version,
    extensionVersion: evtVersion ?? "",
    machineId,
    sessionId,
    uriScheme: _env.uriScheme,
    remoteName: _env.remoteName,
    deviceName,
    deviceStr,
  }
}

const getInfo = () => {
  return _info
}

export default {
  getIdeType,
  init,
  getInfo,
}