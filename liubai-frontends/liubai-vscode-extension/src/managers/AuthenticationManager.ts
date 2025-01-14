import * as vscode from 'vscode';
import cfg from "../config"; 
import valTool from '../utils/val-tool';
import type { LiuAuthStatus } from '../types';

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

    // to register uri handler
    const handler = {
      "handleUri": async (uri: vscode.Uri) => {

      }
    }
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

