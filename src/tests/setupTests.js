import * as consoleFailTestModule from 'console-fail-test'
import { toMatchDiffSnapshot } from 'snapshot-diff'

import { queryCache } from './reactQueryProviderHOC'
import { flushAllPromises } from './utils'

global.expect.extend({ toMatchDiffSnapshot })

const allowConsoleDefaultConfig = {
  debug: false,
  error: false,
  log: false,
  warn: false,
}

let allowConsoleRuntimeConfig = Object.assign({}, allowConsoleDefaultConfig)
global.allowConsole = function (config = allowConsoleDefaultConfig) {
  allowConsoleRuntimeConfig = Object.assign({}, allowConsoleDefaultConfig, config)
}

global.allowConsole({
  debug: false,
  error: false,
  log: false,
  warn: false,
})

global.beforeAll(() => {
  consoleFailTestModule.cft({
    testFramework: 'jest',
    spyLibrary: 'jest',
    console: allowConsoleRuntimeConfig,
  })
})

global.afterAll(() => {
  allowConsoleRuntimeConfig = Object.assign({}, allowConsoleDefaultConfig)
})

global.afterEach(async () => {
  queryCache.clear()
  await flushAllPromises()
})

// WEB MOCKS
// To replicate the browser behaviour in our node test environement (jsdom), we have to make the following mocks :
global.GeolocationPositionError = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
}
