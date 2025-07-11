import type { GetImagePath } from "../types/index";
import { LiuUtil } from "../utils/liu-util/index";
import { colorData } from "../config/default-data";


export function getThemeBehavior(
  getImagePath: GetImagePath,
) {
  const theme = LiuUtil.getCurrentTheme()
  const imagePath = getImagePath()
  const colors = colorData[theme]

  const behavior = Behavior({
    data: {
      theme,
      imagePath,
      colors,
    },

    pageLifetimes: {
      show() {
        this.calculateTheme()
      }
    },

    lifetimes: {
      attached() {
        this.calculateTheme()
      }
    },


    methods: {
      calculateTheme() {
        const newTheme = LiuUtil.getCurrentTheme()
        if(newTheme === this.data.theme) return
        const newImagePath = getImagePath()
        const newColors = colorData[newTheme]
        this.setData({ 
          theme: newTheme, 
          imagePath: newImagePath,
          colors: newColors,
        })
      }
    },

  })

  return behavior
}