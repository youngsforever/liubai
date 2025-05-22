// Function Name: happy-system

import cloud from "@lafjs/cloud"
import { getDocAddId, valTool } from "@/common-util"
import type { 
  HappySystemAPI,
  LiuRqReturn,
  Partial_Id,
  Table_AiRoom,
  Table_Credential,
  Table_Showcase,
  Table_User,
} from "@/common-types"
import { getBasicStampWhileAdding, getNowStamp, MINUTE } from "@/common-time"
import { createAdCredential } from "@/common-ids"

const db = cloud.database()
const _ = db.command

export async function main(ctx: FunctionContext) {

  // 1. verify token
  const body = ctx.request?.body ?? {}

  // 2. decide which path to go
  const oT = body.operateType
  let res: LiuRqReturn = { code: "E4000" }
  if(oT === "get-showcase") {
    res = await get_showcase(body)
  }
  else if(oT === "get-weixin-ad") {
    res = await get_weixin_ad(body)
  }
  
  return res
}


async function get_weixin_ad(
  body: Record<string, any>,
): Promise<LiuRqReturn<HappySystemAPI.Res_GetWeixinAd>> {
  // 1. check out params
  const roomId = body.room
  if(!valTool.isStringWithVal(roomId)) {
    return { code: "E4000", errMsg: "Invalid room" }
  }
  const _env = process.env
  const adUnitId = _env.LIU_WX_REWARDED_VIDEO_AD
  if(!adUnitId) {
    return { code: "E5001", errMsg: "adUnitId is not configured" }
  }

  // 2. get room
  const rCol = db.collection("AiRoom")
  const res2 = await rCol.doc(roomId).get<Table_AiRoom>()
  const room = res2.data
  if(!room) {
    return { code: "E4004", errMsg: "no ai room found" }
  }

  // 3. get user
  const userId = room.owner
  const uCol = db.collection("User")
  const res3 = await uCol.doc(userId).get<Table_User>()
  const user = res3.data
  if(!user) {
    return { code: "E4004", errMsg: "no user found" }
  }
  if(user.oState !== "NORMAL") {
    return { code: "E4003", errMsg: "user is not normal" }
  }
  const conversationCountFromAd = user.quota?.conversationCountFromAd ?? 0

  // 4. get credential
  const MIN_10_LATER = getNowStamp() + MINUTE * 10
  const w4 = {
    userId,
    infoType: "weixin-ad",
    expireStamp: _.gt(MIN_10_LATER),
  }
  const cCol = db.collection("Credential")
  const res4 = await cCol.where(w4).getOne<Table_Credential>()
  console.log("get_weixin_ad res4: ", res4)
  let cred = res4.data

  // 5. create credential
  if(!cred) {
    const MIN_25_LATER = getNowStamp() + MINUTE * 25
    const b5 = getBasicStampWhileAdding()
    const newCred: Partial_Id<Table_Credential> = {
      ...b5,
      userId,
      infoType: "weixin-ad",
      expireStamp: MIN_25_LATER,
      verifyNum: 0,
      credential: createAdCredential(),
    }
    const res5 = await cCol.add(newCred)
    const credId = getDocAddId(res5)
    if(!credId) {
      return { code: "E5001", errMsg: "fail to create credential" }
    }
    cred = {
      _id: credId,
      ...newCred,
    }
  }

  // 6. package result
  const res6: HappySystemAPI.Res_GetWeixinAd = {
    operateType: "get-weixin-ad",
    adUnitId,
    conversationCountFromAd,
    credential: cred.credential,
  }
  return { code: "0000", data: res6 }
}


async function get_showcase(
  body: Record<string, any>,
): Promise<LiuRqReturn<HappySystemAPI.Res_GetShowcase>> {
  // 1. check out params
  const key = body.key
  if(!valTool.isStringWithVal(key)) {
    return { code: "E4000", errMsg: "Invalid key" }
  }

  // 2.1 get showcase
  const sCol = db.collection("Showcase")
  const w2: Partial<Table_Showcase> = {
    key,
  }
  const res2 = await sCol.where(w2).getOne<Table_Showcase>()
  const showcase = res2.data
  if(!showcase) {
    return { code: "E4004" }
  }

  // 2.2 check out isOn
  if(showcase.isOn !== "Y") {
    return { code: "E4014" }
  }

  // 3. package result
  const res3: HappySystemAPI.Res_GetShowcase = {
    operateType: "get-showcase",
    title: showcase.title,
    imageUrl: showcase.imageUrl,
    imageH2W: showcase.imageH2W,
    footer: showcase.footer,
  }
  return { code: "0000", data: res3 }
}