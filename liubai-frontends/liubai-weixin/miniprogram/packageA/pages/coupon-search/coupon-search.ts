import { navibarBehavior } from "~/behaviors/navibar-behavior";
import { i18nBehavior } from "~/packageA/behaviors/i18n-behavior";
import { themeBehavior } from "~/packageA/behaviors/theme-behavior";
import { useCsOnLoad } from "./tools/useCouponSearch";
import { pageBehavior } from "~/behaviors/page-behavior";

Component({

  options: {
    pureDataPattern: /^_/,
  },

  behaviors: [
    i18nBehavior("coupon-search"),
    navibarBehavior(),
    themeBehavior(),
    pageBehavior(),
  ],

  methods: {

    onLoad() {
      useCsOnLoad()
    }


  },


})