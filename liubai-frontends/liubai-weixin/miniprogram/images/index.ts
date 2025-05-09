import { LiuApi } from "../utils/LiuApi";

export function getImagePath() {
  const appBaseInfo = LiuApi.getAppBaseInfo()
  const theme = appBaseInfo.theme ?? "light"
  let imagePath = "/images"
  if(theme === "dark") imagePath += "/dark-theme/"
  else imagePath += "/light-theme/"
  return imagePath
}