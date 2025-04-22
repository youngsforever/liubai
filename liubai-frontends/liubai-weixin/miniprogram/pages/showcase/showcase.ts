// showcase.ts

Component({

  data: {
    renderer: "webview",
  },

  lifetimes: {

    attached() {

      const nodesRef = this.createSelectorQuery().select("#showcase-scroll-view")
      nodesRef.boundingClientRect(res => {
        console.log("boundingClientRect res: ", res)
      }).exec()

      this.setData({
        renderer: this.renderer,
      })
      
    }

  },

  methods: {

    onTapBack() {
      wx.navigateBack()
    }

  },
})
