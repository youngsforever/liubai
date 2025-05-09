// custom-navibar.ts

import { sharedBehavior } from "../../behaviors/shared-behavior";
import { themeBehavior } from "../../behaviors/theme-behavior";

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
    showTitle: {
      type: Boolean,
      value: true,
    }
  },

  methods: {
    onTapBack() {
      console.log("onTapBack.......")
    }
  }


})
