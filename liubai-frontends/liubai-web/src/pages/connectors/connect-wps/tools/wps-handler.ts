
export class WpsHandler {

  static domains = ["kdocs.cn", "wps.cn"]

  static isWpsWebhookUrl(webhook_url: string) {
    if(webhook_url.length < 10) return false
    try {
      const url1 = new URL(webhook_url)
      const origin = url1.origin
      const domain = this.domains.find(d => {
        const d1 = "." + d
        const res1 = origin.endsWith(d1)
        if(res1) return true
        const d2 = "/" + d
        const res2 = origin.endsWith(d2)
        return res2
      })
      return Boolean(domain)
    }
    catch(err) {
      console.warn("isWpsWebhookUrl error: ", err)
    }
    return false
  }

}