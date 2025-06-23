import { navibarBehavior } from "~/behaviors/navibar-behavior";
import { i18nBehavior } from "~/packageA/behaviors/i18n-behavior";
import { themeBehavior } from "~/packageA/behaviors/theme-behavior";
import { LiuTunnel } from "~/utils/LiuTunnel";

Component({

  options: {
    pureDataPattern: /^_/,
  },

  behaviors: [
    i18nBehavior("watch-video"),
    navibarBehavior(),
    themeBehavior(),
  ],

  methods: {

    async onLoad() {
      console.log("coupon-search onLoad......")
      const res1 = await LiuTunnel.takeStuff("coupon-search-image")
      console.log("coupon-search onLoad res1: ", res1)
    }


  },


})