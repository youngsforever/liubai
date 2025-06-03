import { onActivated, ref, toRef, watch } from "vue";
import { useTemporaryStore } from "~/hooks/stores/useTemporaryStore";
import { useRouteAndLiuRouter } from "~/routes/liu-router";
import type { ComponentPublicInstance } from "vue"
import type { CcProps } from "./types";
import type { CropperResult } from "vue-advanced-cropper"
import cui from "~/components/custom-ui";
import imgHelper from "~/utils/files/img-helper";
import type { FileSetAPI } from "~/requests/req-types"
import type { LiuImageStore } from "~/types"
import APIs from "~/requests/APIs"
import liuReq from "~/requests/liu-req"
import { uploadViaQiniu } from "~/utils/cloud/upload-tasks/tools/upload-via-qiniu"
import ider from "~/utils/basic/ider";


let isLoading = false
export function useCropperContent(
  props: CcProps,
) {
  const rr = useRouteAndLiuRouter()
  const tempStore = useTemporaryStore()

  onActivated(() => {
    const url = tempStore.imageUrlForCropper
    if(url) return
    rr.router.goHome()
  })

  const cropperRef = ref<ComponentPublicInstance | null>(null)
  const confirmNum = toRef(props, "confirmNum")
  watch(confirmNum, async (newV) => {
    // 1. interrupt
    if(isLoading) return

    // 2. try to get canvas
    const cropper = cropperRef.value as any
    if(!cropper) return
    if(typeof cropper.getResult !== "function") return
    const res = cropper.getResult() as CropperResult
    if(!res) return
    const canvas = res.canvas
    if(!canvas) return

    // 3. show loading
    showCropperLoading()

    // 4. let canvas create blob
    canvas.toBlob(async (blob) => {
      if(!blob) return
      compressFile(blob)
    }, "image/jpeg")
  })

  return {
    tempStore,
    cropperRef,
  }
}

function showCropperLoading(
  title_key: string = "tip.hold_on",
) {
  isLoading = true
  cui.showLoading({ title_key })
}

function hideCropperLoading() {
  if(!isLoading) return
  isLoading = false
  cui.hideLoading()
}

async function compressFile(
  blob: Blob,
) {
  const blobs = await imgHelper.compress([blob], { 
    maxWidth: 256, 
    compressPoint: 33 * 1024,
    convertSize: 32 * 1024,
  })
  console.log("blobs: ", blobs)
  const firstBlob = blobs[0]
  if(!firstBlob) return
  uploadFile(firstBlob)
}

async function uploadFile(
  blob: Blob,
) {
  // 1. get token
  const url = APIs.UPLOAD_FILE
  const param: FileSetAPI.Param = { 
    operateType: "get-upload-token",
    purpose: "avatar",
  }
  const tokenRes = await liuReq.request<FileSetAPI.Res_UploadToken>(url, param)
  console.log("tokenRes: ", tokenRes)
  if (tokenRes.code !== "0000" || !tokenRes.data) {
    console.warn("获取上传 token 失败", tokenRes)
    hideCropperLoading()
    return
  }

  // 2. create file with id
  const file = new File([blob], "avatar.jpg", { type: "image/jpeg" })
  const arrBuf = await file.arrayBuffer()
  const imgStore: LiuImageStore = {
    id: ider.createImgId(),
    name: file.name,
    lastModified: file.lastModified,
    mimeType: file.type,
    arrayBuffer: arrBuf,
    h2w: "1",
    size: file.size,
  }

  // 3. show uploading
  showCropperLoading("common.uploading")

  // 4. upload file
  await uploadViaQiniu(
    tokenRes.data, 
    [imgStore],
    (fileId, res) => {
      const cloud_url = res?.data?.cloud_url
      if (res.code === "0000" && cloud_url) {
        uploadAvatar(imgStore, cloud_url)
      }
      else {
        hideCropperLoading()
      }
    }
  )
}

async function uploadAvatar(
  imgStore: LiuImageStore,
  cloud_url: string,
) {
  imgStore.cloud_url = cloud_url
  
  
}