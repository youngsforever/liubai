import { i18nBehavior } from "~/packageB/behaviors/i18n-behavior";
import { navibarBehavior } from "~/packageB/behaviors/navibar-behavior";
import { pageBehavior } from "~/packageB/behaviors/page-behavior";
import { themeBehavior } from "~/packageB/behaviors/theme-behavior";
import { AddTaskNote } from "~/packageB/types/types-tunnel";
import { LiuTunnel } from "~/packageB/utils/LiuTunnel";
import { LiuApi } from "~/utils/LiuApi";


Component({

  options: {
    pureDataPattern: /^_/,
  },

  behaviors: [
    i18nBehavior("task-add-note"),
    navibarBehavior(),
    themeBehavior(),
    pageBehavior(),
  ],


  data: {
    id: "",
    note: "",
    canSubmit: false,
    focus: false,
    _initedNote: "",
  },

  methods: {

    onLoad() {
      this.toInit()
    },

    async toInit() {
      const res1 = await LiuTunnel.takeStuff<AddTaskNote>("add-task-note")
      if(!res1) return

      let canSubmit = false
      let note = res1.note ?? ""
      if(res1.read_clipboard) {
        try {
          const res2 = await LiuApi.getClipboardData()
          if(res2?.data) {
            note = res2.data
            canSubmit = true
          }
        }
        catch(err) {
          console.warn("fail to get clipboard data")
        }
      }
      if(note.length > 2000) {
        note = note.substring(0, 2000)
      }
      const _initedNote = note
      const focus = Boolean(note)
      this.setData({ note, id: res1.id, focus, canSubmit, _initedNote })
    },

    onInput(e: any) {
      const inputTxt: string = e.detail.value ?? ""
      const trimTxt = inputTxt.trim()
      this.data.note = trimTxt
      
      const canSubmit = Boolean(trimTxt !== this.data._initedNote)
      if(canSubmit !== this.data.canSubmit) {
        this.setData({ canSubmit })
      }
    },



  },

})