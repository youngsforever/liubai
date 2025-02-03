import { reactive } from "vue";
import type { CotPageData } from "./types";
import { pageStates } from "~/utils/atom";


export function useCotPage() {
  const cpData = reactive<CotPageData>({
    pageState: pageStates.LOADING,
  })

  return {
    cpData
  }
}