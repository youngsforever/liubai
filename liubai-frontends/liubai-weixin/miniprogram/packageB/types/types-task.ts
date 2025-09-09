import type { LiuRemindMe } from "./types-atom"

export interface SubmitTaskDateTime {
  whenStamp: number
  remindStamp: number
  remindMe: LiuRemindMe
}