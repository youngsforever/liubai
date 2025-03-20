import type { LiuAppType } from "~/types/types-atom";


export interface AuthorizeViewProps {
  appType: LiuAppType
  code?: string
}

export interface AuthorizeViewEmit {
  (evt: "agree"): void
}

export interface AuthorizeViewData {
  showCode: boolean
  fetchingAgree: boolean
}