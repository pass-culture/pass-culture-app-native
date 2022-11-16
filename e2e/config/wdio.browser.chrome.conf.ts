import config from './wdio.shared.local.appium.conf'
import { env } from './environment/env'
import { demo } from './wdio-demo.conf'

const specs = env.SPECS ? env.SPECS.split(',') : ['./e2e/tests/**/specs/**/browser*.spec.ts']

// ============
// Specs
// ============
config.specs = env.WDIO_DEMO ? [demo.browser.specs] : specs
config.exclude = env.WDIO_DEMO ? [] : [demo.browser.specs]

// ============
// Capabilities
// ============
config.capabilities = [
  {
    browserName: 'chrome',
    maxInstances: 1,
  },
]

config.services = [
  [
    'chromedriver',
    {
      logFileName: 'wdio-chromedriver.log',
      outputDir: './logs',
      chromedriverCustomPath: 'chromedriver',
    },
  ],
]

exports.config = config
