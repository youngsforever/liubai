import * as vscode from 'vscode';
import cfg from "../config"; 
import valTool from '../utils/basic/val-tool';
import type { LiuAuthStatus } from '../types';
import liuInfo from '~/utils/liu-info';
import liuReq from '~/requests/liu-req';
import APIs from '~/requests/APIs';
import time from '~/utils/basic/time';
import { Res_HelloWorld } from '~/types/types-req';

const LOGIN_DATA_KEY = `${cfg.appPrefix}login_data`
const AUTH_CALLBACK_PATH = "/auth-complete"

export class AuthenticationManager {

  private static _instance: AuthenticationManager;
  private _context: vscode.ExtensionContext;
  private _calibrated: boolean = false;

  // data before logging in
  private _state: string | undefined;
  private _credential: string | undefined;
  private _code: string | undefined;

  // `private` is in order to avoid new AuthenticationManager() 
  // from being called by outside
  private constructor(context: vscode.ExtensionContext) {
    this._context = context

    // 1. to register uri handler for `code`
    this.initListenToCode()
    

    // 2. to register `openBrowser` command
    const info = liuInfo.getInfo()
    const extId = info.extensionId
    const uriScheme = info.uriScheme

    const commandName = `${extId}.openBrowser`
    const disposable2 = vscode.commands.registerCommand(commandName, async () => {
      const callbackLink = `${uriScheme}://${extId}${AUTH_CALLBACK_PATH}`
      const callbackUri = vscode.Uri.parse(callbackLink)
      console.log(`callback uri: `, callbackUri)
      console.log(`callback uri toString(): `, callbackUri.toString())
  
      const externalUri = await vscode.env.asExternalUri(callbackUri)
      console.log(`external uri: `, externalUri)
      console.log(`external uri toString(): `, externalUri.toString())

      const appLink = LIU_ENV.LIU_DOMAIN ?? ""
      const appUri = vscode.Uri.parse(appLink, true)

    })
    context.subscriptions.push(disposable2)

    // 4. init async
    this.initAsync()
  }

  private async initAsync() {
    // 1. calibrate time
    await this.timeCalibrate()

    // 2. check out auth status
    await this.getAuthStatus()

  
  }


  private async timeCalibrate() {
    const url = APIs.TIME
    const t1 = time.getLocalTime()
    const res = await liuReq.request<Res_HelloWorld>(url)
    const t2 = time.getLocalTime()
    const { code, data } = res
    if(code !== "0000") return
    if(!data) return

    const clientStamp = Math.round((t2 + t1) / 2)
    const theStamp = data.stamp
    const diff = theStamp - clientStamp
    time.setDiff(diff)

    this._calibrated = true
    return true
  }


  private initListenToCode() {
    const _this = this
    const handler = {
      "handleUri": async (uri: vscode.Uri) => {
        const uriPath = uri.path
        console.warn("see uriPath: ")
        console.log(uriPath)
        if(uriPath !== AUTH_CALLBACK_PATH) {
          console.warn(`the current path is not ${AUTH_CALLBACK_PATH}`)
          return
        }
        console.log("see uri.query:")
        console.log(uri.query)

        const q = new URLSearchParams(uri.query)
        const code = q.get("code")
        const state = q.get("state")
        console.log("see code: ", code)
        console.log("see state: ", state)
        if(!code || !state) {
          console.warn("code and state are required in query")
          return
        }
        if(state !== _this._state) {
          console.warn("state does not match")
          return
        }
        this._code = code
        _this.afterGettingCode()
      }
    }
    vscode.window.registerUriHandler(handler)
  }



  private afterGettingCode() {
    const code = this._code
    const cred = this._credential
    if(!code || !cred) return

  }


  public static getInstance(context: vscode.ExtensionContext) {
    if(!AuthenticationManager._instance) {
      AuthenticationManager._instance = new AuthenticationManager(context)
    }
    return AuthenticationManager._instance
  }

  public async getAuthStatus() {
    const res = await this._context.secrets.get(LOGIN_DATA_KEY)
    if(!res) return
    const data = valTool.strToObj<LiuAuthStatus>(res)
    if(!data || !data.serial || !data.token) return
    liuReq.setAuthStatus(data)
    return data
  }


}

