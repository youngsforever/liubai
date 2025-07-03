import { 
  FileUploader, 
  type ImageUploaderResult,
} from "~/packageA/utils/FileUploader"


export class CouponAddManager {

  // for poster
  private static _file: WechatMiniprogram.MediaFile | null = null
  private static _uploadPromise: Promise<ImageUploaderResult> | null = null

  // for copytext
  private static _copytext: string | null = null
  

  static async addPoster(file: WechatMiniprogram.MediaFile) {
    this._file = file
    this._uploadPoster()
  }

  static async addCopytext(copytext: string) {
    this._copytext = copytext
  }

  private static _uploadPoster() {
    const file = this._file
    if(!file) return false
    this._uploadPromise = FileUploader.uploadViaQiniu(
      file.tempFilePath, 
      "coupon-upload"
    )
    return true
  }

  static reset() {
    this._file = null
    this._uploadPromise = null
    this._copytext = null
  }


}