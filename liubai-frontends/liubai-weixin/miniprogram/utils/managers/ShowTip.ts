import { LiuUtil } from "../liu-util/index";


export class ShowTip {

  static cannotUse() {
    LiuUtil.showCustomModal({
      title_key: "shared.cannot_use_1",
      content_key: "shared.try_again_later",
      showCancel: false,
      confirm_key: "shared.confirm",
    })
  }

}