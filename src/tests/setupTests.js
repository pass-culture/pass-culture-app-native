import '@testing-library/jest-native/extend-expect'
import * as consoleFailTestModule from 'console-fail-test'
import { toHaveNoViolations } from 'jest-axe'

import { server } from 'tests/server'

import { queryCache } from './reactQueryProviderHOC'
import { flushAllPromises } from './utils'

global.expect.extend(toHaveNoViolations)

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
