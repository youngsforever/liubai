

export const rendererBehavior = Behavior({

  data: {
    renderer: "webview",
  },

  lifetimes: {
    attached() {
      console.log("rendererBehavior attached: ", this.renderer)
      this.setData({ renderer: this.renderer })
    }
  },

})