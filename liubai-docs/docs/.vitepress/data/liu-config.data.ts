import { loadEnv, defineLoader } from "vitepress"

export interface Data {
  mainSiteLink: string
  howxmId?: string
}

declare const data: Data
export { data }

export default defineLoader({
  // 类型检查加载器选项
  async load(): Promise<Data> {
    const nodeEnv = process.env.NODE_ENV
    const _env = loadEnv(nodeEnv ?? "", process.cwd())

    console.log("see _env here: ")
    console.log(_env)

    return {
      mainSiteLink: _env.VITE_MAINSITE_LINK ?? "",
      howxmId: _env.VITE_HOWXM_ID,
    }
  }
})
