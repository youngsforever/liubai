import { envData } from "../config/env-data"

const d = envData.API_DOMAIN ?? "/"

export default {
  LOGIN: d + "user-login",
  TIME: d + "hello-world",
  SHOWCASE: d + "happy-system",
  WEIXIN_AD: d + "happy-system",
  USER_SETTINGS: d + "user-settings",
}