import * as crypto from "crypto";
import type { CryptoCipherAndIV } from "~/types";

function trimPemContents(
  str: string,
  direction: 1 | -1,      // 1: 由前往后; -1 由后往前
) {
  let initNum = direction === 1 ? 0 : (str.length - 1)

  for(let i=initNum; i < str.length && i >= 0; i += direction) {
    const v = str[i]
    if(v === "-" || v === "\n") {
      if(direction > 0) {
        str = str.substring(1)
        i--
      }
      else {
        str = str.substring(0, str.length - 1)
      }
      continue
    }
    break
  }
  return str
}


function getPemContents(
  pem: string,
  pemHeader: string,
  pemFooter: string,
) {
  let pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length)

  // 从前方开始扫描，过滤掉 "-" 和 "\n"
  pemContents = trimPemContents(pemContents, 1)

  // 从后方开始扫描
  pemContents = trimPemContents(pemContents, -1)
  
  return pemContents
}

/**
 * 导入 RSA 公钥，参考 
 * https://developer.mozilla.org/zh-CN/docs/Web/API/SubtleCrypto/importKey#%E5%AF%BC%E5%85%A5_subjectpublickeyinfo_%E6%A0%BC%E5%BC%8F%E7%9A%84%E5%AF%86%E9%92%A5
 * @param pem pem格式的公钥
 */
async function importRsaPublicKey(pem: string) {
  const pemHeader = "-----BEGIN PUBLIC KEY-----"
  const pemFooter = "-----END PUBLIC KEY-----"
  const pemContents = getPemContents(pem, pemHeader, pemFooter)

  try {
    // 直接从 base64 转换为 Uint8Array
    const binaryDer = Buffer.from(pemContents, 'base64');
    const theCrypto = getCrypto()
    const key = await theCrypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["encrypt"],
    );

    return key;
  } catch(err) {
    console.warn("Key import failed:")
    console.log(err)
    return null
  }
}

/**
 * 将 uint8Array 转成 base64
 */
function uint8ArrayToBase64(byteArr: Uint8Array) {
  const buffer = Buffer.from(byteArr);
  const b64 = buffer.toString('base64');
  return b64;
}

function arrayBufferToBase64(arrayBuffer: ArrayBuffer) {
  const byteArr = new Uint8Array(arrayBuffer)
  const b64 = uint8ArrayToBase64(byteArr)
  return b64
}

function handleAtob(str: string) {
  return Buffer.from(str, 'base64').toString('binary');
}

/**
 * 将 base64 转成 arrayBuffer
 */
function base64ToArrayBuffer(b64: string) {
  const byteStr = handleAtob(b64)
  const length = byteStr.length
  const buffer = new ArrayBuffer(length)
  const byteArr = new Uint8Array(buffer)
  for (let i = 0; i < length; i++) {
    byteArr[i] = byteStr.charCodeAt(i);
  }
  return buffer
}

function getCrypto() {
  return crypto?.webcrypto
}

async function createKeyWithAES() {
  const theCrypto = getCrypto()
  try {
    const key = await theCrypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"],
    )
    const res = await theCrypto.subtle.exportKey("raw", key)
    const str = arrayBufferToBase64(res)
    return str
  }
  catch(err) {
    console.warn("createKeyWithAES err: ")
    console.log(err)
    console.log(" ")
  }
}

/**
 * 使用 AES 的密钥对明文进行加密
 * 返回 base64 格式的密文
 * @param plainText 明文
 * @param key 经过 raw 导出并转成 base64 的密钥
 * @param iv 初始向量，选填
 */
async function encryptWithAES(
  plainText: string,
  key: string,
  iv?: string,
): Promise<CryptoCipherAndIV> {
  const enc = new TextEncoder()
  const encoded = enc.encode(plainText)

  // 0. 导入公钥
  const theCrypto = getCrypto()
  const buffer = base64ToArrayBuffer(key)
  const cryptoKey = await theCrypto.subtle.importKey(
    "raw", 
    buffer, 
    "AES-GCM",
    true,
    ["encrypt", "decrypt"],
  )

  // 1. 生成一次性的初始向量
  let ivArr = theCrypto.getRandomValues(new Uint8Array(16))
  if(iv) {
    ivArr = new Uint8Array(base64ToArrayBuffer(iv))
  }

  // 2. 开始加密
  const res = await theCrypto.subtle.encrypt(
    { name: "AES-GCM", iv: ivArr },
    cryptoKey,
    encoded
  )

  // 3. 把密文转成 base64
  const cipherStr = arrayBufferToBase64(res)

  // 4. 把 iv 转成 base64
  const iv2 = uint8ArrayToBase64(ivArr)

  return {
    cipherText: cipherStr,
    iv: iv2,
  }
}

async function decryptWithAES(
  data: CryptoCipherAndIV,
  key: string,
) {

  // 0. 导入密钥
  const theCrypto = getCrypto()
  const buffer = base64ToArrayBuffer(key)
  const cryptoKey = await theCrypto.subtle.importKey(
    "raw", 
    buffer, 
    "AES-GCM",
    true,
    ["encrypt", "decrypt"],
  )

  // 1. 导入 iv
  const iv_buffer = base64ToArrayBuffer(data.iv)

  // 2. 将密文转成 buffer
  const cipherBuffer = base64ToArrayBuffer(data.cipherText)

  // 3. 开始解密
  const res = await theCrypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv_buffer },
    cryptoKey,
    cipherBuffer,
  )

  // 4. 解码
  const dec = new TextDecoder()
  const plainText = dec.decode(res)
  
  return plainText
}


/**
 * 使用 RSA 的公钥对明文进行加密
 * 返回 base64 格式的密文
 */
async function encryptWithRSA(
  publicKey: crypto.webcrypto.CryptoKey,
  plainText: string,
) {
  const enc = new TextEncoder()
  const encoded = enc.encode(plainText)

  const theCrypto = getCrypto()
  const cipherBuffer = await theCrypto.subtle.encrypt(
    { name: "RSA-OAEP" }, 
    publicKey, 
    encoded
  )
  
  const cipherStr = arrayBufferToBase64(cipherBuffer)
  return cipherStr
}


export default {
  getCrypto,
  importRsaPublicKey,
  createKeyWithAES,
  encryptWithAES,
  decryptWithAES,
  encryptWithRSA,
}