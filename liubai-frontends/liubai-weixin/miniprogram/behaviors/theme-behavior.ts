import { defaultData } from "../config/default-data";
import { getImagePath } from "../images/index";
import { LiuApi } from "../utils/LiuApi";

export function themeBehavior() {
  const appBaseInfo = LiuApi.getAppBaseInfo()
  const theme = appBaseInfo?.theme ?? defaultData.theme
  const imagePath = getImagePath()

  const behavior = Behavior({
    data: {
      theme,
      imagePath,
    },

    pageLifetimes: {
      show() {
        const newAppBaseInfo = LiuApi.getAppBaseInfo()
        const newTheme = newAppBaseInfo?.theme ?? defaultData.theme
        if(newTheme === this.data.theme) return
        const newImagePath = getImagePath()
        this.setData({ theme: newTheme, imagePath: newImagePath })
      }
    }
  })

  return behavior
}