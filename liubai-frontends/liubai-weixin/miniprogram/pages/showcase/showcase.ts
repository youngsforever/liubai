// showcase.ts

import { navibarBehavior } from "../../behaviors/navibar-behavior"
import { sharedBehavior } from "../../behaviors/shared-behavior"
import { pageStates } from "../../utils/atom-util"

Component({

  behaviors: [
    sharedBehavior(), 
    navibarBehavior
  ],

  data: {
    pState: pageStates.LOADING,
    pageName: "showcase",
  },

  lifetimes: {

    async attached() {
      setTimeout(() => {
        this.setData({ pState: pageStates.OK })
      }, 2000)
    }

  },

  methods: {},
})
