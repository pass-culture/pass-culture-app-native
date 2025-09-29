import '@testing-library/jest-native/extend-expect'

import { TextEncoder } from 'util'

import { toHaveNoViolations } from 'jest-axe'
import { configure } from 'reassure'

import { customConsoleFailTest } from 'tests/customConsoleFailTest'

import { queryCache, mutationCache } from './reactQueryProviderHOC'

// Configuration for performance tests
configure({ testingLibrary: 'react-native' })

global.expect.extend(toHaveNoViolations)
global.TextEncoder = TextEncoder

customConsoleFailTest(
  {
    console: {
      debug: false,
      error: false,
      log: false,
      warn: false,
    },
  },
  {
    error: [
      'The above error occurred in the',
      'When testing, code that causes React state updates should be wrapped into act(...)',
      '',
    ],
    warn: [
      'Node of type rule not supported as an inline style',
      'props.pointerEvents is deprecated. Use style.pointerEvents',
      '[Reanimated] Reading from `value` during component render.',
      '"shadow*" style props are deprecated. Use "boxShadow".',
      'Image: style.resizeMode is deprecated. Please use props.resizeMode.',
      'Image: style.tintColor is deprecated. Please use props.tintColor.',
    ],
  }
)

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
