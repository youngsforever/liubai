// 负责监听 service worker 是否 ready
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSwRegStore = defineStore("swReg", () => {
  const hasSwReady = ref(false)

  const _init = async () => {

    if (typeof navigator === "undefined") return
    if (typeof navigator.serviceWorker === "undefined") return

    try {
      const reg = await navigator.serviceWorker.ready
      console.log("service worker ready:")
      console.log(reg)
      hasSwReady.value = true
    }
    catch (err) {
      console.warn("fail to wait for service worker ready:")
      console.log(err)
    }
  }
  _init()


  return {
    hasSwReady,
  }
})