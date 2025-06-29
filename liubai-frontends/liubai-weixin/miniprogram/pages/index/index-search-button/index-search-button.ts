import { themeBehavior } from "~/behaviors/theme-behavior"
import { i18nBehavior } from "~/behaviors/i18n-behavior"
import { LiuUtil } from "~/utils/liu-util/index"
import { LiuApi } from "~/utils/LiuApi"

Component({

  properties: {
    canSearch: {
      type: Boolean,
      value: false,
    }
  },

  behaviors: [
    i18nBehavior("index"),
    themeBehavior(),
  ],

  methods: {

    onTapButton() {
      const canSearch = this.properties.canSearch
      if(!canSearch) {
        LiuApi.vibrateShort({ type: "light" })
        LiuUtil.showCustomModal({
          title_key: "index.try_1",
          content_key: "index.try_2",
          confirm_key: "index.got_it",
          showCancel: false,
        })
        return
      }
      this.triggerEvent("tap")
    }


  }


})