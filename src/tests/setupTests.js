import * as consoleFailTestModule from 'console-fail-test'
import { toMatchDiffSnapshot } from 'snapshot-diff'

import { server } from 'tests/server'

import { queryCache } from './reactQueryProviderHOC'
import { flushAllPromises } from './utils'

global.expect.extend({ toMatchDiffSnapshot })

const allowConsoleDefaultConfig = {
  debug: false,
  error: false,
  log: false,
  warn: false,
}

let allowConsoleRuntimeConfig = { ...allowConsoleDefaultConfig }
global.allowConsole = function (config = allowConsoleDefaultConfig) {
  allowConsoleRuntimeConfig = { ...allowConsoleDefaultConfig, ...config }
}

global.allowConsole({
  debug: false,
  error: false,
  log: false,
  warn: false,
})

global.beforeAll(() => {
  server.listen()
  consoleFailTestModule.cft({
    testFramework: 'jest',
    spyLibrary: 'jest',
    console: allowConsoleRuntimeConfig,
  })
})

global.afterAll(() => {
  server.resetHandlers()
  server.close()
  allowConsoleRuntimeConfig = { ...allowConsoleDefaultConfig }
})

global.afterEach(async () => {
  queryCache.clear()
  await flushAllPromises()
})
