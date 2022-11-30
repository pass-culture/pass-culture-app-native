import config from './wdio.shared.local.appium.conf'
import { env } from './environment/env'
import { demo } from './wdio-demo.conf'

const specs = env.SPECS ? env.SPECS.split(',') : ['./e2e/tests/**/specs/**/*.spec.ts']
const appiumApp = env.WDIO_DEMO ? demo.android.capabilities['appium:app'] : env.APPIUM_APP

const ciCapability = {
  'appium:androidInstallTimeout': '90000',
  'appium:adbExecTimeout': '50000',
  'appium:androidDeviceReadyTimeout': '30',
}

const capabilityPackage = {
  'appium:app': env.WDIO_DEMO ? demo.android.capabilities['appium:app'] : env.APPIUM_APP,
  'appium:appWaitActivity': env.WDIO_DEMO
    ? demo.android.capabilities['appium:appWaitActivity']
    : env.APPIUM_APP_WAIT_ACTIVITY,
  ...(env.CI ? ciCapability : {}),
}

const capabilityAlreadyInstalled = {
  'appium:appPackage': env.APPIUM_APP_PACKAGE,
  'appium:appActivity': env.APPIUM_APP_ACTIVITY,
  'appium:noReset': true,
}

// ============
// Specs
// ============
config.specs = env.WDIO_DEMO ? [demo.app.specs] : specs
config.exclude = env.WDIO_DEMO
  ? []
  : [demo.app.specs, demo.browser.specs, './e2e/tests/**/specs/**/*.browser.spec.ts']

// ============
// Capabilities
// ============
config.capabilities = [
  {
    // The defaults you need to have in your config
    platformName: 'Android',
    maxInstances: 1,
    // For W3C the appium capabilities need to have an extension prefix
    // http://appium.io/docs/en/writing-running-appium/caps/
    // This is `appium:` for all Appium Capabilities which can be found here
    'appium:deviceName': env.ANDROID_DEVICE_NAME,
    'appium:platformVersion': env.ANDROID_PLATFORM_VERSION,
    'appium:orientation': 'PORTRAIT',
    'appium:automationName': 'UiAutomator2',
    'appium:newCommandTimeout': 240,
    ...(appiumApp ? capabilityPackage : capabilityAlreadyInstalled),
  },
]

exports.config = config
