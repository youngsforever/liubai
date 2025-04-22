// showcase.ts

import { navibarBehavior } from "../../behaviors/navibar-behavior"
import { rendererBehavior } from "../../behaviors/renderer-behavior"
import valTool from "../../utils/val-tool"

Component({

  behaviors: [rendererBehavior, navibarBehavior],

  data: {},

  lifetimes: {

    async attached() {

      await valTool.waitMilli(500)
      console.log("get renderer: ", this.data.renderer)
      
    }

  },

  methods: {

    onTapBack() {
      wx.navigateBack()
    }

  },
})
