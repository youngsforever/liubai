

const waitMilli = (milli: number = 0): Promise<true> => {
  let _t = (a: (a1: true) => void) => {
    setTimeout(() => {
      a(true)
    }, milli)
  }

  return new Promise(_t)
}


// 不要使用 js runtime 的 structuredClone() 进行复制
// 因为 reactive（Proxy）“响应性” 复制后依然存在，但理应不该存在
const copyObject = <T = any>(obj: T): T => {
  let type = typeof obj
  if(type !== "object") return obj

  let obj2: T;
  try {
    obj2 = JSON.parse(JSON.stringify(obj))
  }
  catch(err) {
    return obj
  }
  return obj2
}

// 将字符串 转为 object
const strToObj = <T = any>(str: string): T => {
  let res = {}
  try {
    res = JSON.parse(str)
  }
  catch(err) {}
  return res as T
}

/**
 * 将对象转为 object
 * 若转换失败，返回空字符
 */
const objToStr = <T = any>(obj: T): string => {
  let str = ``
  try {
    str = JSON.stringify(obj)
  }
  catch(err) {}
  return str
}

const format0 = (val: string | number): string => {
  if(typeof val === "number") {
    if(val < 10) return "0" + val
    return "" + val  
  }
  if(val.length < 2) return "0" + val
  return val
}


export default {
  waitMilli,
  copyObject,
  strToObj,
  objToStr,
  format0,
}