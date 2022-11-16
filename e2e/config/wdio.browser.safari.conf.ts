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
    browserName: 'safari',
    maxInstances: 1,
  },
]

config.services = [
  [
    'safaridriver',
    {
      logFileName: 'wdio-safaridriver.log',
      outputDir: './logs',
    },
  ],
]

exports.config = config
