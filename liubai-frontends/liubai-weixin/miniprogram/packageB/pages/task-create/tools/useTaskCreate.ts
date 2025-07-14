import { LiuApi } from "~/packageB/utils/LiuApi"
import { Loginer } from "~/packageB/utils/login/Loginer"

let hasCheckedName = false

export async function handlePost(
  value: string,
  assignees: string[],
) {

  // 1. check if my name exists
  if(!hasCheckedName) {
    hasCheckedName = true
    const res1 = await checkOutName()
    if(!res1) return
  }

  // 2. fetch
  

}


async function checkOutName() {
  const loginData = await Loginer.getLoginData()

  console.log("checkOutName loginData: ", loginData)

  if(!loginData) return false
  if(loginData.nickname) return true
  
  LiuApi.navigateTo({ 
    url: "/packageB/pages/article/article?key=wxmini-login",
  })
  return false
}