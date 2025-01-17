// generate ids

/******************** constants ***************/
const NUMS = "123456789"
const abc = "abcdefghijkmnopqrstuvwxyz"

function _createId(digits: number = 21) {
  let alphabet = NUMS + abc
  const charset = alphabet.length
  let randomString = ""
  for(let i=0; i<digits; i++) {
    const r = Math.floor(Math.random() * charset)
    randomString += alphabet[r]
  }
  return randomString
}

// don't modify `d0` just because whenDraftClear function 
// in add-upload-task.ts is using it
const createDraftId = () => {
  return "d0" + _createId(18)
}

// don't modify `t0` just because _getNewProps function in
// finish-comment.ts is using it
const createThreadId = () => {
  return "t0" + _createId(20)
}

const createRandom = (digits: number = 7) => {
  return _createId(digits)
}

const createUploadTaskId = () => {
  return "u1" + _createId(20)
}

const createSyncGetTaskId = () => {
  return "sg0" + _createId(20)
}

const createEncNonce = () => {
  return _createId(10)
}

const createFileNonce = () => {
  return _createId(4)
}

export default {
  createDraftId,
  createThreadId,
  createRandom,
  createUploadTaskId,
  createSyncGetTaskId,
  createEncNonce,
  createFileNonce,
}