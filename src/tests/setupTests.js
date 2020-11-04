import { toMatchDiffSnapshot } from 'snapshot-diff'

import { server } from 'tests/server'

global.expect.extend({ toMatchDiffSnapshot })

global.beforeAll(() => server.listen())

global.afterEach(() => server.resetHandlers())

global.afterAll(() => server.close())
