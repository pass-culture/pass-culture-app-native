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
