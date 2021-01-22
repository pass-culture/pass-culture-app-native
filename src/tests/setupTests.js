import { toMatchDiffSnapshot } from 'snapshot-diff'

import { server } from 'tests/server'

import { queryCache } from './reactQueryProviderHOC'
import { flushAllPromises } from './utils'

global.expect.extend({ toMatchDiffSnapshot })

global.beforeAll(() => server.listen())

global.afterAll(() => {
  server.resetHandlers()
  server.close()
})

global.afterEach(async () => {
  queryCache.clear()
  await flushAllPromises()
})
