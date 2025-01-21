
interface LiuEnv {
  EXT_VERSION?: string
  API_DOMAIN?: string
  LIU_DOMAIN?: string
  CUSTOMER_SERVICE?: string
  DEVELOPER_EMAIL?: string
  MODE?: "production" | "development"
}

declare const LIU_ENV: LiuEnv