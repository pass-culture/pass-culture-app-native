import { parseBooleanVariables } from './parseBooleanVariables'
import { parseNumberVariables } from './parseNumberVariables'
import { demo } from '../wdio-demo.conf'

const systemEnv = parseBooleanVariables(
  parseNumberVariables(
    process.env as Record<string, string | boolean | number>
  ) as unknown as Record<string, string | boolean | number>
)

export const env = {
  CI: systemEnv.CI || false,
  WDIO_DEMO: systemEnv.WDIO_DEMO || false,
  WDIO_BASE_URL: systemEnv.WDIO_DEMO ? demo.wdio.baseUrl : systemEnv.WDIO_BASE_URL,
  ANDROID_DEVICE_NAME: systemEnv.ANDROID_DEVICE_NAME || 'Nexus6P',
  ANDROID_PLATFORM_VERSION: systemEnv.ANDROID_PLATFORM_VERSION || '10.0',
  IOS_DEVICE_NAME: systemEnv.IOS_DEVICE_NAME || 'iPhone 13',
  IOS_PLATFORM_VERSION: systemEnv.IOS_PLATFORM_VERSION || '15.2',
  APPIUM_TEST_SERVER_PORT: systemEnv.APPIUM_TEST_SERVER_PORT || 4723,
  APPIUM_TEST_SERVER_HOST: systemEnv.APPIUM_TEST_SERVER_HOST || '127.0.0.1',
  APPIUM_APP: systemEnv.APPIUM_APP || '',
  APPIUM_APP_WAIT_ACTIVITY: systemEnv.APPIUM_APP_WAIT_ACTIVITY || '',
}
