import { parseBooleanVariables } from './parseBooleanVariables'
import { parseNumberVariables } from './parseNumberVariables'
import { Environment } from './types'

const ignoredNonNumericEnvs = ['ANDROID_PLATFORM_VERSION', 'IOS_PLATFORM_VERSION']

const systemEnv = parseBooleanVariables(
  parseNumberVariables(
    process.env as Record<string, string | boolean | number>,
    ignoredNonNumericEnvs,
  ) as unknown as Record<string, string | boolean | number>
)

export const env: Environment = {
  CI: systemEnv.CI || false,
  ENVIRONMENT: systemEnv.ENVIRONMENT || 'staging',
  WDIO_BASE_URL: systemEnv.WDIO_BASE_URL,
  ANDROID_DEVICE_NAME: systemEnv.ANDROID_DEVICE_NAME || 'pixel_xl',
  ANDROID_PLATFORM_VERSION: systemEnv.ANDROID_PLATFORM_VERSION
    ? String(systemEnv.ANDROID_PLATFORM_VERSION)
    : '10.0',
  IOS_DEVICE_NAME: systemEnv.IOS_DEVICE_NAME || 'iPhone 13',
  IOS_PLATFORM_VERSION: systemEnv.IOS_PLATFORM_VERSION
    ? String(systemEnv.IOS_PLATFORM_VERSION)
    : '15.2',
  APPIUM_TEST_SERVER_PORT: systemEnv.APPIUM_TEST_SERVER_PORT || 4723,
  APPIUM_TEST_SERVER_HOST: systemEnv.APPIUM_TEST_SERVER_HOST || '127.0.0.1',
  APPIUM_APP: systemEnv.APPIUM_APP || '',
  APPIUM_APP_WAIT_ACTIVITY: systemEnv.APPIUM_APP_WAIT_ACTIVITY || '',
  APPIUM_APP_PACKAGE: systemEnv.APPIUM_APP_PACKAGE || '',
  APPIUM_APP_ACTIVITY: systemEnv.APPIUM_APP_ACTIVITY || '',
  SPECS: systemEnv.SPECS || '',
}
