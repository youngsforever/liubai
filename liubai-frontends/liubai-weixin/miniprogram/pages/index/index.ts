// index.ts

Component({

  data: {},

  lifetimes: {

    attached() {

      const nodesRef = this.createSelectorQuery().select(".liu-scroll-view")
      nodesRef.boundingClientRect(res => {
        console.log("boundingClientRect res: ", res)
      }).exec()

    },

  },

  methods: {

    goToShowcase() {
      wx.navigateTo({
        url: '/pages/showcase/showcase',
        routeType: "wx://upwards",        // wx://bottom-sheet
        routeConfig: {
          barrierColor: "rgba(0, 0, 0, 0.5)",
          barrierDismissible: true,
          popGestureDirection: "multi",
          fullscreenDrag: false,
        },
        routeOptions: {
          round: true,
          height: 75,
        },
      })
    }

  },
})
