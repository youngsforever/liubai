import { navibarBehavior } from "../../behaviors/navibar-behavior";
import { i18nBehavior } from "../../behaviors/i18n-behavior";
import { themeBehavior } from "../../behaviors/theme-behavior";
import { TaskManager } from "../shared/TaskManager";
import valTool from "../../utils/val-tool";
import { defaultData } from "~/packageB/config/default-data";

Component({

  options: {
    pureDataPattern: /^_/,
  },

  behaviors: [
    i18nBehavior("task-create"),
    navibarBehavior(),
    themeBehavior(),
  ],

  data: {
    focus: false,
    assignees: [] as string[],
  },

  methods: {

    onLoad() {
      TaskManager.init()
    },

    onReady() {
      this.toAutoFocus()
    },

    async toAutoFocus() {
      await valTool.waitMilli(defaultData.duration_ms_2)
      this.setData({ focus: true })
    },

  },


})