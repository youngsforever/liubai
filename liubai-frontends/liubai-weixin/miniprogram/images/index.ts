import { defaultData } from "../config/default-data";
import { LiuApi } from "../utils/LiuApi";

export function getImagePath() {
  const appBaseInfo = LiuApi.getAppBaseInfo()
  const theme = appBaseInfo?.theme ?? defaultData.theme
  let imagePath = "/images"
  if(theme === "dark") imagePath += "/dark-theme/"
  else imagePath += "/light-theme/"
  return imagePath
}