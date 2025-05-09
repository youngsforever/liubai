import { getImagePath } from "../images/index";
import { LiuApi } from "../utils/LiuApi";

export function themeBehavior() {
  const appBaseInfo = LiuApi.getAppBaseInfo()
  const theme = appBaseInfo.theme ?? "light"
  const imagePath = getImagePath()

  const behavior = Behavior({
    data: {
      theme,
      imagePath,
    },

    pageLifetimes: {
      show() {
        const newAppBaseInfo = LiuApi.getAppBaseInfo()
        if(newAppBaseInfo.theme === this.data.theme) return
        const newTheme = newAppBaseInfo.theme ?? "light"
        const newImagePath = getImagePath()
        this.setData({ theme: newTheme, imagePath: newImagePath })
      }
    }
  })

  return behavior
}