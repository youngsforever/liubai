import { themeBehavior } from "~/behaviors/theme-behavior"
import { i18nBehavior } from "~/behaviors/i18n-behavior"

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
  ]


})