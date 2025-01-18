
export interface WorkspaceConfig {
  // last stamp when user edited tagList of workspace
  lastOperateTag?: number
}

export interface MemberConfig {
  searchKeywords?: string[]
  searchTagIds?: string[]
  lastOperateName?: number     // last stamp when user edited name
}

export interface MemberNotification {
  ww_qynb_toggle?: boolean
}