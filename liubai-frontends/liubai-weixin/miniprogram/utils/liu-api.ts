

export class LiuApi {


  static getPages() {
    const pages = getCurrentPages()
    return pages
  }

  static navigateTo(opt: WechatMiniprogram.NavigateToOption) {
    wx.navigateTo(opt)
  }

  static navigateBack(opt: WechatMiniprogram.NavigateBackOption) {
    wx.navigateBack(opt)
  }


}