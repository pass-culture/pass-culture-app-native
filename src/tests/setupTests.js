import { server } from 'tests/server'

global.beforeAll(() => server.listen())

global.afterEach(() => server.resetHandlers())

global.afterAll(() => server.close())
