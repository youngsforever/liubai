import { reactive, watch } from "vue"
import type { CwData } from "./types"
import liuEnv from "~/utils/liu-env"
import { 
  type RouteAndLiuRouter, 
  useRouteAndLiuRouter,
} from "~/routes/liu-router"
import type { Res_OC_GetWps } from "~/requests/req-types"
import { pageStates } from "~/utils/atom"
import { useAwakeNum } from "~/hooks/useCommon"
import { useWorkspaceStore } from "~/hooks/stores/useWorkspaceStore"
import APIs from "~/requests/APIs"
import liuReq from "~/requests/liu-req"

export function useConnectWps() {
  const hasBE = liuEnv.hasBackend()
  const rr = useRouteAndLiuRouter()

  const cwData = reactive<CwData>({
    pageState: hasBE ? pageStates.LOADING : pageStates.NEED_BACKEND,
    webhook_toggle: false,
    canSave: false,
  })

  const { awakeNum } = useAwakeNum()
  watch(awakeNum, (newV) => {
    if(newV < 1) return
    if(!hasBE) return
    checkoutData(cwData, rr)
  }, { immediate: true })
  
  return {
    cwData,
  }
}

async function checkoutData(
  cwData: CwData,
  rr: RouteAndLiuRouter,
) {

  // 1. get member id
  const wStore = useWorkspaceStore()
  const memberId = wStore.memberId
  if(!memberId) return

  // 2. fetch data
  const url2 = APIs.OPEN_CONNECT
  const w2 = {
    operateType: "get-wps",
    memberId,
  }
  const res2 = await liuReq.request<Res_OC_GetWps>(url2, w2)

  // 3. handle data
  console.log(res2)

  const code3 = res2.code
  const data3 = res2.data

  // 4. handle response
  if(code3 === "E4003") {
    cwData.pageState = pageStates.NO_AUTH
  }
  else if(code3 === "E4004") {
    cwData.pageState = pageStates.NO_DATA
  }
  else if(code3 === "0000") {
    cwData.pageState = pageStates.OK
  }
  else {
    cwData.pageState = pageStates.NETWORK_ERR
  }

  // 5. handle some required data
  if(code3 !== "0000" || !data3) return
  cwData.webhook_toggle = Boolean(data3.enable === "Y")
  cwData.webhook_url = data3.webhook_url
  cwData.webhook_password = data3.webhook_password
}