import { LiuLoginData } from "~/types";
import { LiuApi } from "../LiuApi";
import { LiuTime } from "../LiuTime";
import { fetchLogin } from "./tools/handle-login";


export class Loginer {

  static canILogin() {
    const res = LiuApi.getApiCategory()
    if(res === "browseOnly") return false
    return true
  }

  private static _loginData: LiuLoginData | undefined
  private static _lastGetLoginDataStamp = 0

  static async getLoginData(
    checkingSession = false,
  ) {
    // 0. get storage from variable
    if(this._loginData && !checkingSession) {
      const stamp0 = this._lastGetLoginDataStamp
      const within = LiuTime.isWithinMillis(stamp0, LiuTime.MINUTE, true)
      if(within) {
        return this._loginData
      }
    }

    // 1. get storage
    const res1 = await LiuApi.getStorage({ 
      key: "login-data",
      encrypt: true,
    })
    const data1 = res1?.data as LiuLoginData | null
    if(!data1) return
    this._loginData = data1
    this._lastGetLoginDataStamp = LiuTime.getLocalTime()

    // 2. check session
    if(checkingSession) {
      const res2 = await LiuApi.checkSession()
      if(!res2) return
    }

    return data1
  }

  static async run() {
    const res1 = await this.getLoginData(true)
    if(res1) {
      this.toRefresh()
    }
    else {
      this.toLogin()
    }
  }

  private static async toLogin() {
    // 1. get js_code
    const js_code = await LiuApi.login()
    if(!js_code) return

    // 2. get credential
    const res2 = LiuApi.getLaunchOptionsSync()
    const credential = res2?.query?.cred as string | undefined
    console.log("credential: ", credential)

    // 3. fetch login
    const res3 = await fetchLogin(js_code, credential)
    if(!res3) return

    // 4. 


  }

  private static async toRefresh() {

  }



}