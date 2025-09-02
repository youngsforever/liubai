import { i18nBehavior } from "~/packageB/behaviors/i18n-behavior";
import { navibarBehavior } from "~/packageB/behaviors/navibar-behavior";
import { pageBehavior } from "~/packageB/behaviors/page-behavior";
import { themeBehavior } from "~/packageB/behaviors/theme-behavior";
import { LiuTunnel } from "~/packageB/utils/LiuTunnel";
import { LiuApi } from "~/packageB/utils/LiuApi";
import { defaultData } from "~/packageB/config/default-data";
import type { UpdateTaskText } from "~/packageB/types/types-tunnel";
import type { UpdateTaskTextType } from "~/packageB/types/types-atom";
import { toConfirm } from "./tools/useTaskUpdateText";

Component({

  options: {
    pureDataPattern: /^_/,
  },

  behaviors: [
    i18nBehavior("task-update-text"),
    navibarBehavior(),
    themeBehavior(),
    pageBehavior(),
  ],


  data: {
    id: "",
    text: "",
    canSubmit: false,
    focus: false,
    noteMaxLength: defaultData.note_max_length,
    titleMaxLength: defaultData.title_max_length,
    _initedText: "",
    updateType: undefined as UpdateTaskTextType | undefined,
  },

  methods: {

    onLoad() {
      this.toInit()
    },

    async toInit() {
      const res1 = await LiuTunnel.takeStuff<UpdateTaskText>("update-task-text")
      if(!res1) return

      // 1. init data
      let canSubmit = false
      let text = res1.text ?? ""
      let focus = false
      const _initedText = text
      const updateType = res1.updateType

      // 2. handle maxlength
      let maxLength = defaultData.note_max_length
      if(updateType === "title") {
        focus = true
        maxLength = defaultData.title_max_length
      }
      if(text.length > maxLength) {
        text = text.substring(0, maxLength)
      }
      
      // 3. set data
      this.setData({ 
        text, 
        id: res1.id, 
        focus, 
        canSubmit, 
        updateType,
        _initedText,
      })
    },

    async onTapPaste() {
      LiuApi.vibrateShort({ type: "medium" })
      let newText = ""
      try {
        const res2 = await LiuApi.getClipboardData()
        const txt2 = res2?.data ?? ""
        newText = txt2.trim()
      }
      catch(err) {
        console.warn("fail to get clipboard data")
      }
      if(!newText) return
      this.setData({ text: newText })
      this.checkCanSubmit(newText)
    },

    onTapClear() {
      LiuApi.vibrateShort({ type: "light" })
      this.setData({ text: "" })
      this.checkCanSubmit("")
    },

    onInput(e: any) {
      const inputTxt: string = e.detail.value ?? ""
      this.data.text = inputTxt
      this.checkCanSubmit(inputTxt)
    },

    checkCanSubmit(inputTxt: string) {
      let canSubmit = Boolean(inputTxt !== this.data._initedText)
      if(canSubmit && this.data.updateType === "title") {
        const trimTxt = inputTxt.trim()
        if(!trimTxt || trimTxt === this.data._initedText) {
          canSubmit = false
        }
      }

      if(canSubmit !== this.data.canSubmit) {
        this.setData({ canSubmit })
      }
    },

    onTapConfirm() {
      if(!this.data.canSubmit) return
      LiuApi.vibrateShort({ type: "medium" })
      const { id, text, updateType } = this.data
      if(!updateType) return
      toConfirm(id, text, updateType)
    },


  },

})