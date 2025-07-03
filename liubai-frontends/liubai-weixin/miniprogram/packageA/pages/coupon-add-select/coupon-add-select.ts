import { navibarBehavior } from "~/behaviors/navibar-behavior"
import { i18nBehavior } from "~/packageA/behaviors/i18n-behavior"
import { themeBehavior } from "~/packageA/behaviors/theme-behavior"
import { LiuApi } from "~/utils/LiuApi"
import { ShowTip } from "~/utils/managers/ShowTip"
import { ImageHelper } from "~/packageA/utils/ImageHelper"
import { CouponAddManager } from "../shared/CouponAddManager"
import { CouponManager } from "../shared/CouponManager"

Component({

  options: {
    pureDataPattern: /^_/,
  },

  behaviors: [
    i18nBehavior("coupon-add-select"),
    navibarBehavior(),
    themeBehavior(),
  ],
  
  data: {
    pageName: "coupon-add-select",
  },

  methods: {

    async onTapPoster() {

      // 0. are you ok
      if(!this.areYouOK()) return

      // 1. choose image
      const res1 = await LiuApi.chooseMedia({ 
        mediaType: ["image"], 
        count: 1, 
        sourceType: ["album"],
        sizeType: ["original"]
      })
      if(!res1) return
      const file = res1.tempFiles[0]
      if(!file) return

      // 2. compress
      const imgHelper = new ImageHelper(file)
      const res2 = await imgHelper.run()
      if(!res2) return

      // 3. are you ok again
      if(!this.areYouOK()) return

      // 4. save image
      CouponAddManager.addPoster(res2)

      LiuApi.navigateTo({
        url: "/packageA/pages/coupon-add-date/coupon-add-date",
        routeType: "wx://modal-navigation",
        routeConfig: {
          allowEnterRouteSnapshotting: true,
          allowExitRouteSnapshotting: true,
        },
      }, this.router)
    },

    onShow() {
      CouponManager.fetchStatus()
      
    },

    areYouOK() {
      const couponStatus = CouponManager.getStatus()
      if(!couponStatus) return true
      if(!couponStatus.can_i_use) {
        ShowTip.cannotUse()
        return false
      }
      return true
    }

  }


})