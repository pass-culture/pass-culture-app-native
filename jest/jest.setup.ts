import { EmitterSubscription, Keyboard } from 'react-native'
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

// It would be better to put it in the __mocks__ folder, but I haven't been able to do that.
// Mock Keyboard.addListener to avoid "TypeError: Cannot read property 'remove' of undefined"
jest.spyOn(Keyboard, 'addListener').mockImplementation(
  () =>
    ({
      remove: jest.fn(),
    }) as unknown as EmitterSubscription
)
