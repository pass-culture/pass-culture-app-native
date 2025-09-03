/* eslint-disable no-undef */
import 'cross-fetch/polyfill'

// @ts-ignore jest can have access to this file but typescript does not know it
// We can see it
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock'

/* See the corresponding mocks in libs/analytics/__mocks__ */
/* Tests passed but there is a console error in web files */
/* console.error
[2021-07-01T00:00:00.000Z]  @firebase/analytics: FirebaseError: Analytics: Dynamic config fetch failed: [400] API key not valid. Please pass a valid API key. (analytics/config-fetch-failed).
  code: 'analytics/config-fetch-failed',
  customData: {
    httpStatus: 400,
    responseMessage: 'API key not valid. Please pass a valid API key.'
  }
} */
jest.mock('libs/analytics/provider')
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

/* See the corresponding mock in libs/environment/__mocks__ */
/* I have problem in web test files, it doesn't work when use it directly */
jest.mock('libs/environment/env')

// I have a problem with mockRNDeviceInfo doesn't recognize by TS
jest.mock('react-native-device-info', () => mockRNDeviceInfo)

jest.unmock('react-native-modal')

// Error: SyntaxError: Cannot use import statement outside a module
// The issue comes from Jest trying to parse a module (react-native-orientation-locker) that uses ESModule syntax (import/export) without being processed by Babel
// A common problem with some React Native libraries not properly packaged for Node.
jest.mock('react-native-orientation-locker')

// useGetFontScale is used in AppButton, so it impacts all buttons like ButtonPrimary, ButtonSecondary, etc.
jest.mock('shared/accessibility/useGetFontScale', () => ({
  useGetFontScale: () => ({ fontScale: 1 }),
}))

// TODO(PC-37747): remove this temporary ignore warnings
// Store the original console.warn
const originalWarn = console.warn

jest.spyOn(console, 'warn').mockImplementation((...args) => {
  if (typeof args[0] === 'string' && args[0].includes('Expected style')) {
    if (args[0].includes('to contain units')) {
      return // Do not log
    }
  }
  // Use the original console.warn for other warnings
  originalWarn.apply(console, args)
})
