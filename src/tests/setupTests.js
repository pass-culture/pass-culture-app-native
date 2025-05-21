import '@testing-library/jest-native/extend-expect'

import { TextEncoder } from 'util'

import { notifyManager } from '@tanstack/query-core'
import * as consoleFailTestModule from 'console-fail-test'
import { toHaveNoViolations } from 'jest-axe'
import { configure } from 'reassure'
import { batch } from 'solid-js'

import { queryCache } from './reactQueryProviderHOC'

// React Query v4 does not expose a safe batchedUpdates for React Native + Jest
// Solid.js's batch() is compatible with TanStack's notifyManager batching logic
notifyManager.setBatchNotifyFunction(batch)

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

global.AbortController = jest.fn(() => ({
  signal: {},
  abort: jest.fn(),
}))

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

if (global.navigator) {
  global.navigator.geolocation = geolocation
  global.navigator.permissions = permissions
  global.navigator.share = share
} else {
  global.navigator = { geolocation, permissions, share }
}
