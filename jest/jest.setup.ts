/* eslint-disable no-undef */
import 'cross-fetch/polyfill'

// @ts-ignore jest can have access to this file but typescript does not know it
// We can see it
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock'

jest.unmock('react-query')

/* See the corresponding mocks in libs/analytics/__mocks__ */
jest.mock('libs/analytics/provider')

/* See the corresponding mock in libs/environment/__mocks__ */
/* I have problem in web test files, it doesn't work when use it directly */
jest.mock('libs/environment/env')

// I have a problem with mockRNDeviceInfo doesn't recognize by TS
jest.mock('react-native-device-info', () => mockRNDeviceInfo)

jest.unmock('react-native-modal')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.mock('@gorhom/bottom-sheet', () => {
  const ActualBottomSheet = jest.requireActual('@gorhom/bottom-sheet/mock').default

  class MockBottomSheet extends ActualBottomSheet {
    close() {
      this.props.onAnimate(0, -1)
    }
    expand() {
      this.props.onAnimate(0, 2)
    }
    collapse() {
      this.props.onAnimate(-1, 0)
    }
  }
  return {
    __esModule: true,
    ...require('@gorhom/bottom-sheet/mock'),
    default: MockBottomSheet,
  }
})
