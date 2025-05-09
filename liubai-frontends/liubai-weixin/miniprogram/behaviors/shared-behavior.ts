import { LiuUtil } from "../utils/liu-util/index"
import { LiuApi } from "../utils/LiuApi"



export function sharedBehavior() {

  const cha = LiuUtil.getCharacteristic()
  
  const behavior = Behavior({

    data: {
      renderer: "webview",
      pageLength: 1,
      isPC: cha.isPC,
    },

    lifetimes: {
      attached() {
        const currentRenderer = this.renderer
        this.setData({ renderer: currentRenderer })
      }
    },

    pageLifetimes: {
      show() {
        const pages = LiuApi.getPages()
        const newPageLength = pages.length
        if(this.data.pageLength !== newPageLength) {
          this.setData({ pageLength: newPageLength })
        }
      }
    }

  })

  return behavior
}