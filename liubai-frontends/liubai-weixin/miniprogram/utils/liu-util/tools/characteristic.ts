import { LiuApi } from "../../LiuApi";
import type { CharacteristicsRes } from "./types";

let result: CharacteristicsRes | undefined

export const handleCharacteristic = () => {
  if(result) return result

  // 1.1 get device info
  const deviceInfo = LiuApi.getDeviceInfo()
  const { platform } = deviceInfo

  // 2. define default platform
  result = {
    isPC: false,
    isMobile: true,
  }

  // 3. for PC
  if(platform === "mac") {
    result.isPC = true
    result.isMobile = false
  }
  else if(platform.includes("windows")) {
    result.isPC = true
    result.isMobile = false
  }
  
  return result
}

