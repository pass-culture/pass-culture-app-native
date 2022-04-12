import { server } from '../tests/server'

global.beforeAll(() => {
  server.listen()
})

global.afterAll(() => {
  server.resetHandlers()
  server.close()
})
