import { LiuApi } from "~/utils/LiuApi"
import valTool from "~/utils/val-tool"

export class ImageHelper {

  private _tempFile: WechatMiniprogram.MediaFile
  private _compressKB = 250
  private _maxPixel = 1024

  constructor(
    file: WechatMiniprogram.MediaFile,
    compressKB?: number,
  ) {
    this._tempFile = file
    if(compressKB) {
      this._compressKB = compressKB
    }
  }


  async run() {
    const size = this._tempFile.size
    const max = this._compressKB * 1024

    // 1. get to compress
    if(size > max) {
      const res1 = await this.compress()
      if(!res1) return
    }

    // 2. return new file
    return valTool.copyObject(this._tempFile)
  }

  private async compress() {
    // 1. get file info
    const file = this._tempFile
    const tempFilePath = file.tempFilePath
    const height = file.height
    const width = file.width
    const size = file.size
    const mB = size / 1024 / 1024

    // 2. set opt
    const quality = mB > 2 ? 70 : 80
    const opt2: WechatMiniprogram.CompressImageOption = {
      src: tempFilePath,
      quality,
    }
    if(height > this._maxPixel && height >= width) {
      opt2.compressedHeight = this._maxPixel
    }
    else if(width > this._maxPixel && width > height) {
      opt2.compressedWidth = this._maxPixel
    }

    // 3. start to compress
    const res3 = await LiuApi.compressImage(opt2)
    console.log("compress res: ", res3)
    if(!res3) return false
    if(!res3.tempFilePath) return false

    // 4. handle width & height
    if(opt2.compressedHeight) {
      file.height = opt2.compressedHeight
      file.width = Math.round(width * (opt2.compressedHeight / height))
    }
    else if(opt2.compressedWidth) {
      file.width = opt2.compressedWidth
      file.height = Math.round(height * (opt2.compressedWidth / width))
    }
    file.tempFilePath = res3.tempFilePath
    return true
  }

}