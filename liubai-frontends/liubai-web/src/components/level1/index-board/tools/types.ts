


export interface IbData {
  a2hs: boolean
  newVersion: boolean
  subscribePrompt: boolean
}

export type IbDataKey = keyof IbData

export interface IbChildProps {
  expand: boolean
}

export interface IbChildEmits {
  (evt: "confirm"): void
  (evt: "cancel"): void
}

export interface IbChildData {
  enable: boolean
  show: boolean
}