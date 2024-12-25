import { usePrefix } from "~/hooks/useCommon";
import liuEnv from "~/utils/liu-env";

export function useSettingMore() {
  const { prefix } = usePrefix()

  const _env = liuEnv.getEnv()
  const serviceTermsLink = _env.SERVICE_TERMS_LINK ?? "/"
  const privacyPolicyLink = _env.PRIVACY_POLICY_LINK ?? "/"

  return {
    prefix,
    serviceTermsLink,
    privacyPolicyLink,
  }
}