import { reactive, toRef, watch } from "vue"
import type { PageState } from "~/types/types-atom"
import type { PvData, PvProps } from "./types"
import { pageStates } from "~/utils/atom"
import liuUtil from "~/utils/liu-util"
import cfg from "~/config"


export const TRANSITION_MS = 300

export function usePlaceholderView(props: PvProps) {
  const pvData = reactive<PvData>({
    enable: true,
    show: true,
    toggleTimeout: undefined,
  })
  const pState = toRef(props, "pState")
  watch(pState, (newV) => {
    whenPStateChange(newV, pvData)
  }, { immediate: true })

  return {
    pvData,
  }
}

function whenPStateChange(
  newV: PageState,
  pvData: PvData,
) {
  const isLoading = Boolean(newV === pageStates.LOADING)
  const isNoData = Boolean(newV >= pageStates.NO_DATA)
  const needOpen = Boolean(isLoading || isNoData)
  const { isOpening, isClosing } = liuUtil.view.getOpeningClosing(
    pvData.enable, pvData.show
  )
  
  if(needOpen && !isOpening) {
    open(pvData)
  }
  else if(!needOpen && !isClosing) {
    close(pvData)
  }
}


async function open(
  pvData: PvData,
) {
  if(pvData.show) return
  if(pvData.toggleTimeout) {
    clearTimeout(pvData.toggleTimeout)
  }
  pvData.enable = true
  pvData.toggleTimeout = setTimeout(() => {
    pvData.toggleTimeout = undefined
    pvData.show = true
  }, cfg.frame_duration)
}

async function close(
  pvData: PvData,
) {
  if(!pvData.enable) return
  if(pvData.toggleTimeout) {
    clearTimeout(pvData.toggleTimeout)
  }
  pvData.show = false
  pvData.toggleTimeout = setTimeout(() => {
    pvData.toggleTimeout = undefined
    pvData.enable = false
  }, TRANSITION_MS)
}