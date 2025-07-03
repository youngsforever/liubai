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
    i18nBehavior("coupon-add-date"),
    sharedBehavior(),
    navibarBehavior(),
    themeBehavior(),
  ],
  
  data: {
    pageName: "coupon-add-date",
    _justPosted: false,
  },


  methods: {

    goToSuccess() {
      LiuApi.navigateTo({
        url: "/packageA/pages/coupon-add-success/coupon-add-success",
        routeType: "wx://modal-navigation",
        routeConfig: {
          barrierColor: "rgba(0, 0, 0, 0.6)",
          barrierDismissible: true,
        },
      })
    },

    onShow() {
      if(this.data._justPosted) {
        LiuApi.navigateBack()
        this.data._justPosted = false
        return
      }
    },


  }


})