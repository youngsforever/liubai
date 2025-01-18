import type { LiuStateConfig, TagView } from "./types-atom"
import type { OState, OState_3, SpaceType } from "./types-basic"
import type { 
  MemberConfig, 
  MemberNotification, 
  WorkspaceConfig,
} from "./types-custom"

export interface Cloud_ImageStore {
  id: string
  name: string
  lastModified: number       // 文件最后修改的时间戳，精确到 ms
  mimeType?: string
  width?: number
  height?: number
  h2w?: string
  url: string
  url_2?: string             // 低分辨率的图片地址
  blurhash?: string
  someExif?: any             // extra exif info
  size?: number              // 单位为 bytes
}


/** 登录时，后端传回来的用户基础信息
 * 只有基础的，复杂的数据配置，需要另外调用
*/
export interface LiuSpaceAndMember {
  // 关于 member 的信息
  memberId: string
  member_name?: string
  member_avatar?: Cloud_ImageStore
  member_oState: OState_3
  member_config?: MemberConfig
  member_notification?: MemberNotification

  // 关于 workspace 的信息
  spaceId: string
  spaceType: SpaceType
  space_oState: OState
  space_owner: string
  space_name?: string
  space_avatar?: Cloud_ImageStore
  space_stateConfig?: LiuStateConfig
  space_tagList?: TagView[]
  space_config?: WorkspaceConfig
}