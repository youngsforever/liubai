import { navibarBehavior } from "../../behaviors/navibar-behavior";
import { i18nBehavior } from "../../behaviors/i18n-behavior";
import { themeBehavior } from "../../behaviors/theme-behavior";
import { pageBehavior } from "../../behaviors/page-behavior";
import type { LpKey } from "./tools/types";
import { LiuApi } from "~/packageB/utils/LiuApi";
import { getOrderId, getWxpayParam } from "./tools/useLandingPremium";
import { LiuTime } from "~/packageB/utils/LiuTime";
import { Loginer } from "~/packageB/utils/login/Loginer";
import { ShowTip } from "~/packageB/utils/managers/ShowTip";

Component({

  options: {
    pureDataPattern: /^_/,
  },

  behaviors: [
    i18nBehavior("landing-premium"),
    navibarBehavior(),
    themeBehavior(),
    pageBehavior(),
  ],
  
  data: {
    pageName: "landing-premium",
    key: "add-calendar" as LpKey | undefined,
    hasPaid: false,
    _paymentData: {
      stamp1: 0,
      orderId: "",
    },
  },

  methods: {

    onLoad() {
      this.handleOrderId()
    },


    async handleOrderId() {
      const orderId = await getOrderId()
      if(!orderId) return
      const paymentData = this.data._paymentData
      paymentData.stamp1 = LiuTime.getTime()
      paymentData.orderId = orderId
      return orderId
    },

    async onTapBuy() {
      LiuApi.vibrateShort({ type: "medium" })

      // 1. get wx_mini_openid
      const loginData = Loginer.getLoginDataSync()
      const wx_mini_openid = loginData?.wx_mini_openid
      if(!wx_mini_openid) {
        ShowTip.showErrMsg("no wx_mini_openid")
        return
      }

      // 2. check out availability of orderId
      const paymentData = this.data._paymentData
      let orderId: string | undefined = paymentData.orderId
      const within10mins = LiuTime.isWithinMillis(
        paymentData.stamp1,
        LiuTime.MINUTE * 10,
      )
      if(!orderId || !within10mins) {
        orderId = await this.handleOrderId()
        if(!orderId) return
      }

      // 3. get wxpay param
      const wxpayParam = await getWxpayParam(orderId, wx_mini_openid)
      if(!wxpayParam) return

      // 4. pay
      const _this = this
      LiuApi.requestPayment({
        ...wxpayParam,
        success(res4) {
          console.warn("requestPayment success: ", res4)
          _this.setData({ hasPaid: true })
        },
        fail(err4) {
          console.warn("requestPayment fail: ", err4)
        }
      })
    },

    onTapBackAfterPaid() {
      LiuApi.vibrateShort({ type: "medium" })
      LiuApi.navigateBack()
    },

    onTapLearnMore() {
      LiuApi.vibrateShort({ type: "light" })

    },




  },


})