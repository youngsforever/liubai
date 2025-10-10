import type { PageState } from "~/types/types-atom"

export interface CwData {
  pageState: PageState
  backup_toggle: boolean
  canSave: boolean
  isSaving: boolean

  personal_base_token?: string
  base_id?: string
  table_id?: string
  original_personal_base_token: string
  original_base_id: string
  original_table_id: string
}