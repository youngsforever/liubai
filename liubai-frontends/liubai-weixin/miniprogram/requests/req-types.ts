import type { LocalTheme } from "~/types/types-atom"
import type { LiuSpaceAndMember, UserSubscription } from "~/types/types-cloud"
import type { LocalLocale } from "~/types/types-locale"

/********************** Hello World *******************/
export interface Res_HelloWorld {
  stamp: number
}

/********************** User Login *******************/
export namespace UserLoginAPI {
  export interface Res_Normal {
    // 只有一个 user 符合时
    open_id?: string
    github_id?: number
    theme?: LocalTheme
    language?: LocalLocale
    spaceMemberList?: LiuSpaceAndMember[]
    subscription?: UserSubscription
    serial_id?: string
    token?: string
    userId?: string
  }

  export interface Res_WxMiniSession extends Res_Normal {
    operateType: "wx_mini_session"
    wx_mini_openid: string
  }
}


/****************** Happy System api ***************/
export namespace HappySystemAPI {
  export interface Res_GetShowcase {
    operateType: "get-showcase"
    title: string
    imageUrl?: string
    imageH2W?: string
    footer?: string
  }

  export interface Res_GetWeixinAd {
    operateType: "get-weixin-ad"
    adUnitId: string
    conversationCountFromAd: number
    conversationToAd: number
    credential: string
  }

  export interface Res_PostWeixinAd {
    operateType: "post-weixin-ad"
    conversationCountFromAd: number
  }
}


