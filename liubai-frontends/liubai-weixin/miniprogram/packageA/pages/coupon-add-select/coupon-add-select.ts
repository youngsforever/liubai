import { navibarBehavior } from "~/behaviors/navibar-behavior"
import { sharedBehavior } from "~/behaviors/shared-behavior"
import { i18nBehavior } from "~/packageA/behaviors/i18n-behavior"
import { themeBehavior } from "~/packageA/behaviors/theme-behavior"
import { LiuApi } from "~/utils/LiuApi"

Component({

  options: {
    pureDataPattern: /^_/,
  },

  behaviors: [
    i18nBehavior("coupon-add-select"),
    sharedBehavior(), 
    navibarBehavior(),
    themeBehavior(),
  ],
  
  data: {
    pageName: "coupon-add-select",
  },

  methods: {
    onTapPoster() {
      LiuApi.navigateTo({
        url: "/packageA/pages/coupon-add-date/coupon-add-date",
        routeType: "wx://modal-navigation",
      })
    },
  }


})