import '@testing-library/jest-native/extend-expect'

import { TextEncoder } from 'util'

import { toHaveNoViolations } from 'jest-axe'
import { configure } from 'reassure'

import { queryCache, mutationCache } from './reactQueryProviderHOC'

// Configuration for performance tests
configure({ testingLibrary: 'react-native' })

global.expect.extend(toHaveNoViolations)
global.TextEncoder = TextEncoder

// Handle React 19 AggregateError issues in tests
// Override global error handling to prevent AggregateErrors from crashing tests
const originalUnhandledRejection = process.listeners('unhandledRejection')
const originalUncaughtException = process.listeners('uncaughtException')

process.removeAllListeners('unhandledRejection')
process.removeAllListeners('uncaughtException')

process.on('unhandledRejection', (reason, promise) => {
  // Suppress React 19 AggregateErrors that cause test timeouts
  if (reason && reason.name === 'AggregateError') {
    console.warn('Suppressed AggregateError in tests:', reason.message)
    return
  }
  // Re-throw other unhandled rejections
  originalUnhandledRejection.forEach(listener => listener(reason, promise))
})

process.on('uncaughtException', (error) => {
  // Suppress React 19 AggregateErrors that cause test timeouts
  if (error && error.name === 'AggregateError') {
    console.warn('Suppressed AggregateError in tests:', error.message)
    return
  }
  // Re-throw other uncaught exceptions
  originalUncaughtException.forEach(listener => listener(error))
})

global.afterEach(async () => {
  queryCache.clear()
  mutationCache.clear()
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
if (global.navigator) {
  global.navigator.geolocation = geolocation
  global.navigator.permissions = permissions
  global.navigator.share = share
} else {
  global.navigator = { geolocation, permissions, share }
}
