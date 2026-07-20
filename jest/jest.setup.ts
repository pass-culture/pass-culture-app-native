import 'cross-fetch/polyfill'
import { EmitterSubscription, Keyboard } from 'react-native'
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock'
import 'react-native-gesture-handler/jestSetup'

jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'))
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'))
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
jest.mock('libs/firebase/analytics/analytics')

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
jest.mock('shared/accessibility/helpers/zoomHelpers', () => ({
  useMobileFontScale: () => ({ mobileFontScale: 1 }),
  useMobileFontScaleToDisplay: ({ default: at100PercentZoom }) => at100PercentZoom,
  useNumberOfLine: (defaultValue: number) => defaultValue,
  useNumberOfLinesForZoom: (defaultValue: number) => defaultValue,
  useNumberOfLinesForZoomTitleSubtitle: (
    titleDefaultValue: number,
    subtitleDefaultValue: number
  ) => ({
    title: titleDefaultValue,
    subtitle: subtitleDefaultValue,
  }),
  useWebZoomToDisplay: ({ default: at100PercentZoom }) => at100PercentZoom,
  useZoomInPercent: () => 100,
}))

// impacts to much tests and risks launching unhandled requests that are difficult to detect and can create unstable tests.
jest.mock('queries/settings/settingsQuery')

// It would be better to put it in the __mocks__ folder, but I haven't been able to do that.
// Mock Keyboard.addListener to avoid "TypeError: Cannot read property 'remove' of undefined"
jest.spyOn(Keyboard, 'addListener').mockImplementation(
  () =>
    ({
      remove: jest.fn(),
    }) as unknown as EmitterSubscription
)

// Ensure document and window have dispatchEvent methods
// This is needed for Node 25+ compatibility where these may not be properly initialized
if (typeof document !== 'undefined' && !document.dispatchEvent) {
  document.dispatchEvent = jest.fn()
}

if (typeof window !== 'undefined' && !window.dispatchEvent) {
  window.dispatchEvent = jest.fn()
}
