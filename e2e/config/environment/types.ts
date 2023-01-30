export interface Environment {
  CI: boolean
  ENVIRONMENT: string
  WDIO_BASE_URL: string
  ANDROID_DEVICE_NAME: string
  ANDROID_PLATFORM_VERSION: string
  IOS_DEVICE_NAME: string
  IOS_PLATFORM_VERSION: string
  APPIUM_TEST_SERVER_PORT: number
  APPIUM_TEST_SERVER_HOST: string
  APPIUM_APP: string
  APPIUM_APP_WAIT_ACTIVITY: string
  APPIUM_APP_PACKAGE: string
  APPIUM_APP_ACTIVITY: string
  SPECS: string
  API_BASE_URL: string
  END_TO_END_TESTS_EMAIL_ADDRESS: string
}
