// showcase.ts

import { navibarBehavior } from "~/behaviors/navibar-behavior"
import { sharedBehavior } from "~/behaviors/shared-behavior"
import { pageStates } from "~/utils/atom-util"
import type { ShowcaseData } from "./tools/types"
import { fetchShowcaseByKey } from "./tools/useShowcase"
import { HappySystemAPI } from "~/requests/req-types"
import valTool from "~/utils/val-tool"

Component({

  options: {
    pureDataPattern: /^_/,
  },

  behaviors: [
    sharedBehavior(), 
    navibarBehavior
  ],

  data: {
    pState: pageStates.LOADING,
    pageName: "showcase",
    showcase: undefined as ShowcaseData | undefined,
    _key: "",
  },

  methods: {

    onLoad(query: Record<string, string>) {
      if(query?.key) {
        this.data._key = query.key
        this.getShowcaseByKey()
      }
    },

    async getShowcaseByKey() {
      const key = this.data._key
      if(!key) return

      const res = await fetchShowcaseByKey(key)
      console.log("getShowcaseByKey res: ")
      console.log(res)
      
      const code = res.code
      if(code === "E4004") {
        this.setData({ pState: pageStates.NO_DATA })
        return
      }
      if(code === "E4014") {
        this.setData({ pState: pageStates.TOO_HOT })
        return
      }
      
      const data = res.data
      if(!data) {
        this.setData({ pState: pageStates.NETWORK_ERR })
        return
      }

      this.packageShowcase(data)
    },

    packageShowcase(
      res: HappySystemAPI.Res_GetShowcase
    ) {
      let showcase: ShowcaseData = {
        title: res.title,
        imageUrl: res.imageUrl,
        percentH2W: undefined,
        footer: res.footer,
      }
      const imageH2W = res.imageH2W
      if(imageH2W && valTool.isStringAsNumber(imageH2W)) {
        const h2w = Math.round(Number(imageH2W) * 100)
        showcase.percentH2W = `${h2w}%` 
      }
      this.setData({ showcase, pState: pageStates.OK })
    },

  },
})
