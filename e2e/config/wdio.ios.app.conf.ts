import config from './wdio.shared.local.appium.conf'
import { env } from './environment/env'
import { demo } from './wdio-demo.conf'

const specs = env.SPECS ? env.SPECS.split(',') : ['./e2e/tests/**/specs/**/*.spec.ts']

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
    platformName: 'iOS',
    maxInstances: 1,
    // For W3C the appium capabilities need to have an extension prefix
    // This is `appium:` for all Appium Capabilities which can be found here
    // http://appium.io/docs/en/writing-running-appium/caps/
    'appium:deviceName': env.IOS_DEVICE_NAME,
    'appium:platformVersion': env.IOS_PLATFORM_VERSION,
    'appium:orientation': 'PORTRAIT',
    'appium:automationName': 'XCUITest',
    'appium:app': env.WDIO_DEMO ? demo.ios.capabilities['appium:app'] : env.APPIUM_APP,
    'appium:newCommandTimeout': 240,
    'appium:wdaLaunchTimeout': 600000,
    'appium:wdaStartupRetries': 3,
    'appium:wdaStartupRetryInterval': 20000,
    'appium:language': 'en-US',
    'appium:isHeadless': env.CI,
  },
]

exports.config = config
