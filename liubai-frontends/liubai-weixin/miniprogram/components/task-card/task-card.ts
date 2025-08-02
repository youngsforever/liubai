import { sharedBehavior } from "~/behaviors/shared-behavior";
import { i18nBehavior } from "~/behaviors/i18n-behavior"

Component({

  behaviors: [
    sharedBehavior(),
    i18nBehavior("task-card"),
  ],

  properties: {
    task: {
      type: Object,
      value: {},
    },
  },


})