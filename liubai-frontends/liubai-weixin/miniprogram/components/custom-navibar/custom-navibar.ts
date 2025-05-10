// custom-navibar.ts

import { sharedBehavior } from "../../behaviors/shared-behavior";
import { themeBehavior } from "../../behaviors/theme-behavior";
import { LiuApi } from "../../utils/LiuApi";

Component({

  data: {},

  behaviors: [
    sharedBehavior(),
    themeBehavior(),
  ],

  properties: {
    height1: {
      type: Number,
      value: 0
    },
    height2: {
      type: Number,
      value: 0
    },
    visible: {
      type: Boolean,
      value: true,
    },
    title: {
      type: String,
    }
  },

  methods: {
    onTapBack() {
      LiuApi.vibrateShort({ type: "light" })

      const pages = LiuApi.getPages()
      const pLength = pages.length
      if(pLength <= 1) {
        LiuApi.exitMiniProgram()
      }
      else {
        LiuApi.navigateBack()
      }
    }
  }


})
