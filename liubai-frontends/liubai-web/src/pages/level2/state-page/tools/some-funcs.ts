import { db } from "~/utils/db"
import { useThreadShowStore } from "~/hooks/stores/useThreadShowStore"
import { equipThreads } from "~/utils/controllers/equip/threads"
import { LocalToCloud } from "~/utils/cloud/LocalToCloud"
import { getDefaultThread } from "~/utils/other/thread-related"

export async function addNewThreadToKanban(
  stateId: string,
  inputTxt: string,
) {
  // 1. get default thread
  const aThread = getDefaultThread(inputTxt)
  if(!aThread) return

  // 2. add some specific info
  aThread.stateId = stateId
  aThread.stateStamp = aThread.insertedStamp

  // 3. insert the new thread into db.contents
  const res3 = await db.contents.add(aThread)

  // 4. notify other components
  const threadShows = await equipThreads([aThread])
  const tStore = useThreadShowStore()
  tStore.setNewThreadShows(threadShows)

  // 5. upload to cloud
  if(aThread.storageState === "LOCAL") return
  LocalToCloud.addTask({
    uploadTask: "thread-post", 
    target_id: aThread._id,
    operateStamp: aThread.insertedStamp,
  })
}
