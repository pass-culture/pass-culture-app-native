import '@testing-library/jest-native/extend-expect'

import { TextEncoder } from 'util'

import * as consoleFailTestModule from 'console-fail-test'
import { toHaveNoViolations } from 'jest-axe'
import { configure } from 'reassure'

import { PositionError } from '__mocks__/react-native-geolocation-service'

import { queryCache } from './reactQueryProviderHOC'

// Configuration for performance tests
configure({ testingLibrary: 'react-native' })

global.expect.extend(toHaveNoViolations)
global.TextEncoder = TextEncoder

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

global.afterEach(async () => {
  queryCache.clear()
})

// AbortController needs to be mocked because it is not supported in our current version of Jest
global.AbortController = jest.fn(() => ({
  signal: {},
  abort: jest.fn(),
}))

// WEB MOCKS
// To replicate the browser behavior in our node test environment (jsdom), we have to make the following mocks :
global.GeolocationPositionError = PositionError

const geolocation = {
  getCurrentPosition: jest.fn((success) =>
    Promise.resolve(success({ coords: { latitude: 48.85, longitude: 2.29 } }))
  ),
}
const permissions = {
  query: jest.fn(async () => ({ state: 'granted' })),
}
const share = jest.fn()
if (global.navigator) {
  global.navigator.geolocation = geolocation
  global.navigator.permissions = permissions
  global.navigator.share = share
} else {
  global.navigator = { geolocation, permissions, share }
}
