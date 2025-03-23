import { reactive } from "vue"
import type { CwData } from "./types"
import liuEnv from "~/utils/liu-env"
import { useRouteAndLiuRouter } from "~/routes/liu-router"
import { pageStates } from "~/utils/atom"

export function useConnectWps() {
  const hasBE = liuEnv.hasBackend()
  const rr = useRouteAndLiuRouter()

  const cwData = reactive<CwData>({
    // pageState: hasBE ? pageStates.LOADING : pageStates.NEED_BACKEND,
    pageState: pageStates.OK,
    webhook_toggle: false,
  })
  
  return {
    cwData,
  }
}