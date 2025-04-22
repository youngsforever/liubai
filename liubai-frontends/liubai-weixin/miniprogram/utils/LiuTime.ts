

export class LiuTime {


  static getLocalTime() {
    return new Date().getTime()
  }

  static getTime() {
    return new Date().getTime()
  }

  static getTimezone() {
    const d = new Date()
    const t = d.getTimezoneOffset()
    const t2 = -t / 60
    return t2
  }
  

  static isWithinMillis(
    stamp: number,
    ms: number,
    onlyLocal = false,
  ) {
    const now = onlyLocal ? LiuTime.getLocalTime() : LiuTime.getTime()
    const diff = now - stamp
    if (diff < ms) return true
    return false
  }

}