import { LiuApi } from "../utils/LiuApi"
import valTool from "../utils/val-tool"
import type { BoundingClientRectResolver } from "../types"

export const navibarBehavior = Behavior({

  data: {
    height1: 0,     // 通常指状态栏的高度
    height2: 33,     // 通常指胶囊的高度
    lastResizeTimeout: 0,
  },

  lifetimes: {
    attached() {
      this.calculateHeight()
    }
  },

  pageLifetimes: {

    resize() {
      const _this = this
      if(this.data.lastResizeTimeout) {
        clearTimeout(this.data.lastResizeTimeout)
      }
      this.data.lastResizeTimeout = setTimeout(() => {
        _this.calculateHeight()
      }, 450)
    }
  },

  methods: {
  
      async calculateHeight() {
  
        // 1. get window and screen info
        const windowInfo = LiuApi.getWindowInfo()
        console.log("windowInfo: ", windowInfo)
  
        // 2. get menu button info
        const menuButtonInfo = LiuApi.getMenuButtonBoundingClientRect()
        console.log("menuButtonInfo: ", menuButtonInfo)
  
        // 3. get scroll view info
        const svInfo = await this.getSvBoundingClientRect()
        console.log("svInfo: ", svInfo)
  
  
        const safeArea = windowInfo.safeArea ?? {}
        const safeTop = safeArea?.top ?? 0
        const mbTop = menuButtonInfo?.top ?? 0
        let height1 = Math.max(safeTop, mbTop)
        let height2 = menuButtonInfo.height ?? 0
  
        const newData: Record<string, any> = {}
        if(height1 >= 0) newData.height1 = height1
        if(height2 >= 0) newData.height2 = height2
  
        
        if(valTool.objHasAnyKey(newData)) {
          this.setData(newData)
        }
      },
  
  
      getSvBoundingClientRect() {
        const nodesRef = this.createSelectorQuery().select(".liu-scroll-view")
        const _wait = (a: BoundingClientRectResolver) => {
          nodesRef.boundingClientRect(a).exec()
        }
        return new Promise(_wait)
      }
  
    },
  
})