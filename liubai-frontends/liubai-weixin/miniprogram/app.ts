// app.ts
import { LiuApi } from "./utils/LiuApi"

App({
  
  globalData: {
    appName: "liubai",
  },

  onLaunch() {

    const skylineInfo = LiuApi.getSkylineInfoSync()
    console.log("skyline info: ")
    console.log(skylineInfo)
    
  },
})