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
    browserName: 'chrome',
    maxInstances: 1,
  },
]

config.services = (
  config.services?.filter((service) => service instanceof Array && service[0] !== 'appium') || []
).concat([
  [
    'chromedriver',
    {
      logFileName: 'wdio-chromedriver.log',
      outputDir: './logs',
      chromedriverCustomPath: 'chromedriver',
    },
  ],
])

exports.config = config
