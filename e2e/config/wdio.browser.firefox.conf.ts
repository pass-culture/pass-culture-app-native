import config from './wdio.shared.local.appium.conf'
import { env } from './environment/env'
import { demo } from './wdio-demo.conf'

// ============
// Specs
// ============
config.specs = env.WDIO_DEMO ? [demo.browser.specs] : ['./e2e/tests/**/specs/**/browser*.spec.ts']
config.exclude = env.WDIO_DEMO ? [] : [demo.browser.specs]

// ============
// Capabilities
// ============
config.capabilities = [
  {
    browserName: 'firefox',
    maxInstances: 1,
  },
]

config.services = [
  [
    'geckodriver',
    {
      logFileName: 'wdio-geckodriver.log',
      outputDir: './logs',
    },
  ],
]

exports.config = config
