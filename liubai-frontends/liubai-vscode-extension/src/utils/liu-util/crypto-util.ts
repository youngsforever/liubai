import * as crypto from "crypto";

/**
 * 将 uint8Array 转成 base64
 */
function uint8ArrayToBase64(byteArr: Uint8Array): string {
  const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let i = 0;
  const len = byteArr.length;

  while (i < len) {
    const byte1 = byteArr[i++];
    const byte2 = i < len ? byteArr[i++] : undefined;
    const byte3 = i < len ? byteArr[i++] : undefined;

    // 将 3 个字节转换为 4 个 Base64 字符
    const enc1 = byte1 >> 2;
    const enc2 = ((byte1 & 3) << 4) | (byte2 !== undefined ? byte2 >> 4 : 0);
    const enc3 = byte2 !== undefined ? ((byte2 & 15) << 2) | (byte3 !== undefined ? byte3 >> 6 : 0) : 64; // 64 是填充字符 '='
    const enc4 = byte3 !== undefined ? byte3 & 63 : 64; // 64 是填充字符 '='

    let triplet = base64Chars[enc1] + base64Chars[enc2];
    triplet += (enc3 === 64 ? '=' : base64Chars[enc3]);
    triplet += (enc4 === 64 ? '=' : base64Chars[enc4]);
    result += triplet;
  }

  return result;
}

function arrayBufferToBase64(arrayBuffer: ArrayBuffer) {
  const byteArr = new Uint8Array(arrayBuffer)
  const b64 = uint8ArrayToBase64(byteArr)
  return b64
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

export default {
  getCrypto,
  createKeyWithAES,
}