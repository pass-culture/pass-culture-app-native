import '@testing-library/jest-native/extend-expect'
import * as consoleFailTestModule from 'console-fail-test'
import { toHaveNoViolations } from 'jest-axe'

import { server } from 'tests/server'

import { queryCache } from './reactQueryProviderHOC'
import { flushAllPromises } from './utils'

global.expect.extend(toHaveNoViolations)

global.beforeAll(() => {
  server.listen()
  consoleFailTestModule.cft({
    testFramework: 'jest',
    spyLibrary: 'jest',
    console: {
      debug: false,
      error: false,
      log: false,
      warn: false,
    },
  })
})

global.afterAll(() => {
  server.resetHandlers()
  server.close()
})

global.afterEach(async () => {
  queryCache.clear()
  await flushAllPromises()
})

// AbortController needs to be mocked because it is not supported in our current version of Jest
global.AbortController = jest.fn(() => ({
  signal: {},
  abort: jest.fn(),
}))

// WEB MOCKS
// To replicate the browser behaviour in our node test environement (jsdom), we have to make the following mocks :
global.GeolocationPositionError = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
}
const geolocation = {
  getCurrentPosition: jest.fn((success) =>
    Promise.resolve(success({ coords: { latitude: 48.85, longitude: 2.29 } }))
  ),
}
const permissions = {
  query: jest.fn(async () => ({ state: 'granted' })),
}
const share = jest.fn()
if (!global.navigator) {
  global.navigator = { geolocation, permissions, share }
} else {
  global.navigator.geolocation = geolocation
  global.navigator.permissions = permissions
  global.navigator.share = share
}
