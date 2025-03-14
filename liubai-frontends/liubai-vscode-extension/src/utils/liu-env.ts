

function getEnv() {

  const extVersion = LIU_ENV.EXT_VERSION
  const apiDomain = LIU_ENV.API_DOMAIN
  const liuDomain = LIU_ENV.LIU_DOMAIN
  const customerService = LIU_ENV.CUSTOMER_SERVICE
  const developerEmail = LIU_ENV.DEVELOPER_EMAIL
  const mode = LIU_ENV.MODE
  const appName = LIU_ENV.APP_NAME
  const appPrefix = LIU_ENV.APP_PREFIX

  return {
    extVersion,
    apiDomain,
    liuDomain,
    customerService,
    developerEmail,
    mode,
    appName,
    appPrefix,
  }

}

export default {
  getEnv,
}