import type { LiuIDEType, LiuInfo } from "../types"
import * as vscode from 'vscode'
import cfg from "../config"

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
  
  _info = {
    ideType,
    isDesktop,
    isWeb,
    extensionId,
    extensionVersion: evtVersion ?? "",
    machineId: _env.machineId,
    sessionId: _env.sessionId,
    uriScheme: _env.uriScheme,
    remoteName: _env.remoteName,
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