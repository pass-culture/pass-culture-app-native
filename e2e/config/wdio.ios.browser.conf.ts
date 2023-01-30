import config from './wdio.shared.local.appium.conf'
import { env } from './environment/env'

const specs = env.SPECS ? env.SPECS.split(',') : ['./e2e/tests/**/specs/**/*.spec.ts']

// ============
// Specs
// ============
config.specs = specs
config.exclude = ['./e2e/tests/**/specs/**/*.app.spec.ts']

// ============
// Capabilities
// ============
config.capabilities = [
  {
    // The defaults you need to have in your config
    browserName: 'safari',
    platformName: 'iOS',
    maxInstances: 1,
    // For W3C the appium capabilities need to have an extension prefix
    // This is `appium:` for all Appium Capabilities which can be found here
    // http://appium.io/docs/en/writing-running-appium/caps/
    'appium:deviceName': env.IOS_DEVICE_NAME,
    'appium:platformVersion': env.IOS_PLATFORM_VERSION,
    'appium:orientation': 'PORTRAIT',
    'appium:automationName': 'XCUITest',
    'appium:newCommandTimeout': 240,
    'appium:wdaLaunchTimeout': 300000,
  },
]

exports.config = config
