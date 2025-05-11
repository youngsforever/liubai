import { defaultData } from "../../config/default-data";
import { LiuApi } from "../LiuApi";
import { handleCharacteristic, handleDeviceString } from "./tools/characteristic";

export class LiuUtil {

  static getCharacteristic() {
    return handleCharacteristic()
  }

  static getDeviceString() {
    return handleDeviceString()
  }

  static goHome() {
    const res1 = this.naviBackToHome()
    if(res1) return
    LiuApi.redirectTo({ url: defaultData.homePath })
  }

  private static naviBackToHome() {
    const pages = LiuApi.getPages()
    const pLength = pages.length
    if(pLength < 2) return false

    let delta = 0
    for(let i = pLength - 2; i >= 0; i--) {
      const thePage = pages[i]
      const thePageName = thePage.data.pageName
      if(thePageName === "index") {
        delta = (pLength - 1) - i
        break
      }
    }

    if(delta > 0) {
      LiuApi.navigateBack({ delta })
    }

    return Boolean(delta > 0)
  }

}