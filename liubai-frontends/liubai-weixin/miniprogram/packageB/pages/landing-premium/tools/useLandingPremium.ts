import APIs from "~/packageB/requests/APIs";
import { LiuReq } from "~/packageB/requests/LiuReq";
import type { 
  Res_PO_CreateOrder, 
  Res_PO_WxpayMini, 
  Res_SubPlan_Info,
} from "~/packageB/requests/req-types";
import { LiuUtil } from "~/packageB/utils/liu-util/index";
import { LiuApi } from "~/packageB/utils/LiuApi";
import { ShowTip } from "~/packageB/utils/managers/ShowTip";


export async function getOrderData() {
  // 1. get subscription plan
  const url1 = APIs.SUBSCRIBE_PLAN
  const param1 = { operateType: "monthly_info" }
  const res1 = await LiuReq.request<Res_SubPlan_Info>(url1, param1)
  const {
    code: code1,
    data: data1,
  } = res1
  if(code1 !== "0000" || !data1) return
  const isWxpayOn = data1.wxpay?.isOn
  if(!isWxpayOn) return
  const subscription_id = data1.id

  // 2. create order
  const url2 = APIs.PAYMENT_ORDER
  const param2 = { 
    operateType: "create_order",
    subscription_id,
  }
  const res2 = await LiuReq.request<Res_PO_CreateOrder>(url2, param2)
  console.log("getOrderData res2.data: ", res2.data)
  return res2.data?.orderData
}

export async function getWxpayParam(
  order_id: string,
  wx_mini_openid: string,
) {
  // 1. fetch
  const url1 = APIs.PAYMENT_ORDER
  const param1 = {
    operateType: "wxpay_mini",
    order_id,
    wx_mini_openid,
  }
  LiuUtil.showCustomLoading({ title_key: "shared.hold_on" })
  const res1 = await LiuReq.request<Res_PO_WxpayMini>(url1, param1)
  LiuApi.hideLoading()

  // 2. handle result
  const result = res1.data?.param
  if(!result) {
    console.warn("fail to fetch wxpay param", res1)
    ShowTip.showErrMsg("fail to fetch wxpay param", res1)
    return
  }

  return result
}