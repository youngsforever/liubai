// Function Name: happy-system

import cloud from "@lafjs/cloud"
import { valTool, verifyToken } from "@/common-util"
import type { 
  HappySystemAPI,
  LiuRqReturn,
  Table_Showcase, 
  VerifyTokenRes_B,
} from "@/common-types"

const db = cloud.database()

export async function main(ctx: FunctionContext) {

  // 1. verify token
  const body = ctx.request?.body ?? {}
  const vRes = await verifyToken(ctx, body)
  if(!vRes.pass) return vRes.rqReturn

  // 2. decide which path to go
  const oT = body.operateType
  let res: LiuRqReturn = { code: "E4000" }
  if(oT === "get-showcase") {
    res = await get_showcase(vRes, body)
  }
  
  return res
}


async function get_showcase(
  vRes: VerifyTokenRes_B,
  body: Record<string, any>,
): Promise<LiuRqReturn<HappySystemAPI.Res_GetShowcase>> {
  // 1. check out params
  const key = body.key
  if(!valTool.isStringWithVal(key)) {
    return { code: "E4000", errMsg: "Invalid key" }
  }

  // 2. get showcase
  const sCol = db.collection("Showcase")
  const w2: Partial<Table_Showcase> = {
    key,
    isOn: "Y",
  }
  const res2 = await sCol.where(w2).getOne<Table_Showcase>()
  const showcase = res2.data
  if(!showcase) {
    return { code: "E4004" }
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