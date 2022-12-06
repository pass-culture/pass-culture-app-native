import config from './wdio.shared.local.appium.conf'
import { env } from './environment/env'
import { demo } from './wdio-demo.conf'

const specs = env.SPECS ? env.SPECS.split(',') : ['./e2e/tests/**/specs/**/*.spec.ts']

// ============
// Specs
// ============
config.specs = env.WDIO_DEMO ? [demo.browser.specs] : specs
config.exclude = env.WDIO_DEMO
  ? []
  : [demo.app.specs, demo.browser.specs, './e2e/tests/**/specs/**/*.app.spec.ts']

// ============
// Capabilities
// ============
config.capabilities = [
  {
    platformName: 'Android',
    browserName: 'chrome',
    maxInstances: 1,
    'goog:chromeOptions': {
      args: ['--disable-pop-blocking'],
    },
    // For W3C the appium capabilities need to have an extension prefix
    // http://appium.io/docs/en/writing-running-appium/caps/
    // This is `appium:` for all Appium Capabilities which can be found here
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': env.ANDROID_DEVICE_NAME,
    'appium:platformVersion': env.ANDROID_PLATFORM_VERSION,
    'appium:orientation': 'PORTRAIT',
    'appium:newCommandTimeout': 240,
  },
]

exports.config = config
