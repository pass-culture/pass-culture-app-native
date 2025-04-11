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

/* See the corresponding mock in libs/environment/__mocks__ */
/* I have problem in web test files, it doesn't work when use it directly */
jest.mock('libs/environment/env')

// I have a problem with mockRNDeviceInfo doesn't recognize by TS
jest.mock('react-native-device-info', () => mockRNDeviceInfo)

jest.unmock('react-native-modal')

// TODO(PC-34456): remove this global mock
jest.mock('features/navigation/RootNavigator/rootRoutes')

jest.mock('@react-native-firebase/perf', () => {
  const mockTrace = {
    putMetric: jest.fn(),
    // Mock for trace.stop() - needs to return a resolved Promise because it's awaited
    stop: jest.fn().mockResolvedValue(undefined),
  }
  const mockPerfInstance = {
    // Mock for perf().startTrace() - needs to return a resolved Promise containing the mockTrace object because it's awaited
    startTrace: jest.fn().mockResolvedValue(mockTrace),
  }
  // Return the mock function for the default export `perf()`
  return jest.fn(() => mockPerfInstance)
})
