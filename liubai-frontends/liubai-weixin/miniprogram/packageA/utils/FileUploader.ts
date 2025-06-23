import APIs from "~/requests/APIs"
import { LiuReq } from "~/requests/LiuReq"
import { FileSetAPI } from "~/requests/req-types"
import { createFileNonce } from "~/utils/basic/ider"
import { LiuTime } from "~/utils/LiuTime"
import valTool from "~/utils/val-tool"
import { envData } from "~/config/env-data"
import type { FilePurpose } from "~/types/types-atom"

export class FileUploader {

  private static async getQiniuToken(purpose: FilePurpose) {
    const body: FileSetAPI.Param = {
      operateType: "get-upload-token",
      purpose,
    }
    const url = APIs.UPLOAD_FILE
    const res = await LiuReq.request<FileSetAPI.Res_UploadToken>(
      url, 
      body,
    )
    console.log("tokenRes: ", res)
    return res
  }

  static async uploadViaQiniu(
    localPath: string, 
    purpose: FilePurpose,
  ) {
    // 0. get upload url
    const uploadUrl = envData.LIU_QINIU_UPLOAD
    if(!uploadUrl) {
      console.warn("fail to get upload url")
      return
    }
    

    // 1. get token
    const tokenRes = await this.getQiniuToken(purpose)
    if (tokenRes.code !== "0000" || !tokenRes.data) {
      console.warn("fail to get token for uploading", tokenRes)
      return
    }

    // 2. get required params
    const dataForUpload = tokenRes.data
    const prefix = dataForUpload?.prefix ?? ""
    const suffix = valTool.getSuffix(localPath)
    const now = LiuTime.getTime()
    const nonce = createFileNonce()
    const key = `${prefix}-${now}-${nonce}.${suffix}`
    console.log("key: ", key)




  }

}