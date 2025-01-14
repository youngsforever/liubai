import * as vscode from 'vscode';
import cfg from "../config"; 
import valTool from '../utils/val-tool';
import type { LiuAuthStatus } from '../types';
import liuInfo from '../utils/liu-info';

const LOGIN_DATA_KEY = `${cfg.appPrefix}login_data`

export class AuthenticationManager {

  private static _instance: AuthenticationManager;
  private _context: vscode.ExtensionContext;

  // data after logging in
  private _serial = "";
  private _token = "";

  // data before logging in
  private _state: string | undefined;
  private _credential: string | undefined;
  private _code: string | undefined;

  // `private` is in order to avoid new AuthenticationManager() 
  // from being called by outside
  private constructor(context: vscode.ExtensionContext) {
    const _this = this
    this._context = context

    // 1. to register uri handler
    const handler = {
      "handleUri": async (uri: vscode.Uri) => {
        const uriPath = uri.path
        console.warn("see uriPath: ")
        console.log(uriPath)
        if(uriPath !== "/auth-complete") {
          console.warn("当前 uriPath 不是 /auth-complete")
          return
        }
        console.log("see uri.query:")
        console.log(uri.query)

        const q = new URLSearchParams(uri.query)
        const code = q.get("code")
        const state = q.get("state")
        console.log("see code: ", code)
        console.log("see state: ", state)
      }
    }
    vscode.window.registerUriHandler(handler)

    // 2. to register `openBrowser` command
    const info = liuInfo.getInfo()
    const extId = info.extensionId
    const uriScheme = info.uriScheme

    const commandName = `${extId}.openBrowser`
    const disposable2 = vscode.commands.registerCommand(commandName, async () => {
      const callbackLink = `${uriScheme}://${extId}/auth-complete`;
      const callbackUri = vscode.Uri.parse(callbackLink);
      console.log(`callback uri: `, callbackUri);
      console.log(`callback uri toString(): `, callbackUri.toString())
  
      const externalUri = await vscode.env.asExternalUri(callbackUri)
      console.log(`external uri: `, externalUri)
      console.log(`external uri toString(): `, externalUri.toString())

      


    })
    context.subscriptions.push(disposable2)
  }

  private afterGettingCode() {

  }


  public static getInstance(context: vscode.ExtensionContext) {
    if(!AuthenticationManager._instance) {
      AuthenticationManager._instance = new AuthenticationManager(context)
    }
    return AuthenticationManager._instance
  }

  public async checkAuthStatus() {
    const res = await this._context.secrets.get(LOGIN_DATA_KEY)
    if(!res) return false
    const data = valTool.strToObj<LiuAuthStatus>(res)
    if(!data || !data.serial || !data.token) return false
    this._serial = data.serial
    this._token = data.token

    return true
  }

  public getAuthStatus(): LiuAuthStatus {
    return {
      serial: this._serial,
      token: this._token,
    }
  }



}

