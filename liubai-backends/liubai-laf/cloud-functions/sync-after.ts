// Function Name: sync-after
import cloud from '@lafjs/cloud'
import type { Table_Content, Table_User } from '@/common-types'
import { 
  checkIfUserSubscribed, 
  decryptEncData, 
  type DecryptEncData_B,
} from '@/common-util'

const db = cloud.database()
const _ = db.command

const AI_CLUSTER_FREE = 10

interface AfterPostingThreadOpt {
  disableAiCluster?: boolean
}

export async function afterPostingThread(
  id: string,
  opt?: AfterPostingThreadOpt,
) {
  // 1. get thread
  const cCol = db.collection("Content")
  const res1 = await cCol.doc(id).get<Table_Content>()
  const thread = res1.data
  if(!thread) return

  // 1.2 decrypt data
  const res1_2 = decryptEncData(thread)
  if(!res1_2.pass) return

  // 2. get user
  const userId = thread.user
  const uCol = db.collection("User")
  const res2 = await uCol.doc(userId).get<Table_User>()
  const user = res2.data
  if(!user) return

  // 3. decide whether to go to cluster
  let goToCluster = true
  if(opt?.disableAiCluster) goToCluster = false
  const quota = user.quota
  const aiClusterCount = quota?.aiClusterCount ?? 0
  const hasSubscribed = checkIfUserSubscribed(user)
  if(aiClusterCount >= AI_CLUSTER_FREE && !hasSubscribed) {
    goToCluster = false
  }

  // 4. go to cluster
  if(goToCluster) {
    await ai_cluster(thread, user, res1_2)
  }


}


async function ai_cluster(
  thread: Table_Content,
  user: Table_User,
  decryptedData: DecryptEncData_B,
) {

}