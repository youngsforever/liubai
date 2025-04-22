/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
    appName: string
  }
  userInfoReadyCallback?: WechatMiniprogram.GetUserInfoSuccessCallback
}