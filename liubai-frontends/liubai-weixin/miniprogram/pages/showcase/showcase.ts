// showcase.ts

Component({

  data: {},

  lifetimes: {

    attached() {

      const nodesRef = this.createSelectorQuery().select("#showcase-scroll-view")
      nodesRef.boundingClientRect(res => {
        console.log("boundingClientRect res: ", res)
      }).exec()
      
    }

  },

  methods: {

    onTapBack() {
      wx.navigateBack()
    }

  },
})
