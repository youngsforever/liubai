import * as vscode from 'vscode';
import zhHans from "./messages/zh-Hans.json"
import zhHant from "./messages/zh-Hant.json"
import en from "./messages/en.json"

export class i18n {

  private static messages: Record<string, string> = {}

  static init() {
    let lang = vscode.env.language.toLowerCase()
    lang = lang.replace("_", "-")
    
    if(lang === "zh-hans" || lang === "zh-cn") {
      this.messages = zhHans
    }
    else if(lang === "zh-hant" || lang === "zh-tw" || lang === "zh-hk") {
      this.messages = zhHant
    }
    else {
      this.messages = en
    }
  }

  static t(key: string, opt?: Record<string, string | number>) {
    const val = this.messages[key] ?? ""
    if(!val) return ""
    if(!opt) return val
    return this.fill(val, opt)
  }

  static fill(res: string, opt: Record<string, string | number>) {
    const keys = Object.keys(opt)
    for(let i=0; i<keys.length; i++) {
      const v = keys[i]
      const theVal = opt[v]
      const dynamicPattern = `{${v}}`
      const escapedPattern = dynamicPattern.replace(/[{}]/g, '\\$&')
      const regexPattern = new RegExp(escapedPattern, 'g')
      res = res.replace(regexPattern, theVal.toString()) 
    }
    return res
  }


}