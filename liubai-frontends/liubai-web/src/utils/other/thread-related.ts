import { useWorkspaceStore } from "~/hooks/stores/useWorkspaceStore";
import time from "../basic/time";
import ider from "../basic/ider";
import liuEnv from "../liu-env";
import type { ContentLocalTable } from "~/types/types-table";
import type { LiuContent } from "~/types/types-atom";

export function getDefaultThread(
  inputTxt: string,
) {
  // 1. get current space info
  const wStore = useWorkspaceStore()
  const spaceId = wStore.spaceId
  const spaceType = wStore.spaceType
  const user = wStore.userId
  const member = wStore.memberId
  if(!spaceType || !spaceId || !user || !member) return


  // 2. package new thread
  const now = time.getTime()
  const liuDesc: LiuContent[] = [
    { 
      content: [{ type: "text", text: inputTxt }], 
      type: "paragraph",
    }
  ]
  const search_other = inputTxt.toLowerCase()
  const newId = ider.createThreadId()
  const canISync = liuEnv.canISync()
  const aThread: ContentLocalTable = {
    _id: newId,
    first_id: newId,
    user,
    member,
    infoType: "THREAD",
    oState: "OK",
    visScope: "DEFAULT",
    storageState: canISync ? "WAIT_UPLOAD" : "LOCAL",
    aiReadable: "Y",
    liuDesc,

    emojiData: { total: 0, system: [] },

    insertedStamp: now,
    createdStamp: now,
    updatedStamp: now,
    editedStamp: now,

    search_other,
    spaceId,
    spaceType,
    levelOne: 0,
    levelOneAndTwo: 0,
  }

  return aThread
}