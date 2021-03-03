import * as consoleFailTestModule from 'console-fail-test'
import { toMatchDiffSnapshot } from 'snapshot-diff'

import { server } from 'tests/server'

import { queryCache } from './reactQueryProviderHOC'
import { flushAllPromises } from './utils'

global.expect.extend({ toMatchDiffSnapshot })

global.failTestOnConsole = function ({
  doNotFailOnDebug = false,
  doNotFailOnError = false,
  doNotFailOnLog = false,
  doNotFailOnWarn = false,
} = {}) {
  consoleFailTestModule.cft({
    testFramework: 'jest',
    spyLibrary: 'jest',
    console: {
      debug: doNotFailOnDebug,
      error: doNotFailOnError,
      log: doNotFailOnLog,
      warn: doNotFailOnWarn,
    },
  })
}

global.beforeAll(() => server.listen())

global.afterAll(() => {
  server.resetHandlers()
  server.close()
})

global.afterEach(async () => {
  queryCache.clear()
  await flushAllPromises()
})
