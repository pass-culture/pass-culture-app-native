import { toMatchDiffSnapshot } from 'snapshot-diff'

import { server } from 'tests/server'

global.expect.extend({ toMatchDiffSnapshot })

global.beforeAll(() => server.listen())

global.afterAll(() => {
  server.resetHandlers()
  server.close()
})
