import APIs from "~/requests/APIs";
import { LiuReq } from "~/requests/LiuReq";
import { UserLoginAPI } from "~/requests/req-types";

export async function fetchLogin(
  js_code: string,
  credential?: string,
) {
  const w1 = {
    operateType: "wx_mini_session",
    js_code,
    credential,
  }
  const url1 = APIs.LOGIN
  const res1 = await LiuReq.request<UserLoginAPI.Res_WxMiniSession>(url1, w1)
  return res1
}

export async function fetchEnter() {

}

export async function fetchLatest() {
  
}