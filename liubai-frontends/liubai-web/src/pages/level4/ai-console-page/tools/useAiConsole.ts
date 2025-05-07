
import { onActivated, reactive, watch } from "vue"
import type { AcData } from "./types"
import { pageStates } from "~/utils/atom";
import middleBridge from "~/utils/middle-bridge";

export function useAiConsole() {
  const acData = reactive<AcData>({
    pageState: pageStates.OK,
    voicePreference: "female",
  })

  watch(() => acData.voicePreference, (newV, oldV) => {
    if(newV === oldV) return
    console.log("voicePreference changed......")
    console.log("newV: ", newV)
    console.log("oldV: ", oldV)
  })

  onActivated(() => {
    middleBridge.setAppTitle({ val_key: "ai_console.title" })
  })

  return {
    acData,
  }
}