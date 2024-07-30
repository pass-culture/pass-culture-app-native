/* eslint-disable no-undef */
import 'cross-fetch/polyfill'

// @ts-ignore jest can have access to this file but typescript does not know it
// We can see it
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock'

jest.unmock('react-query')
/* We disable the following warning, which can be safely ignored as the code
  is not executed on a device :
  "Animated: `useNativeDriver` is not supported because the native animated module is missing.
  Falling back to JS-based animation." */
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

/* We disable the following warning, which can be safely ignored as the code
  is not executed on a device :
  "Invariant Violation: Native module cannot be null." */
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

/* Alerts cannot be opened in node.js environment */
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}))

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

/* See the corresponding mocks in features/navigation/RootNavigator/__mocks__ */
jest.mock('features/navigation/RootNavigator/routes')
jest.mock('features/navigation/TabBar/routes')

/* See the corresponding mocks in features/navigation/RootNavigator/linking/__mocks__ */
jest.mock('features/navigation/RootNavigator/linking/withAuthProtection')

/* See the corresponding mocks in libs/analytics/__mocks__ */
jest.mock('libs/analytics/logEventAnalytics')
jest.mock('libs/analytics/provider')

jest.mock('libs/appState')

/* See the corresponding mock in libs/environment/__mocks__ */
jest.mock('libs/environment/env')

jest.mock('react-native-device-info', () => mockRNDeviceInfo)

// Global mock customFocusOutline because generate console warn "Node of type rule not supported as an inline style"
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('libs/react-native-batch', () => jest.requireActual('__mocks__/libs/react-native-batch'))

jest.unmock('react-native-modal')

jest.mock('@shopify/flash-list', () => {
  const ActualFlashList = jest.requireActual('@shopify/flash-list').FlashList
  class MockFlashList extends ActualFlashList {
    componentDidMount() {
      super.componentDidMount()
      this.rlvRef?._scrollComponent?._scrollViewRef?.props?.onLayout({
        nativeEvent: { layout: { height: 250, width: 800 } },
      })
    }
  }
  return {
    ...jest.requireActual('@shopify/flash-list'),
    FlashList: MockFlashList,
  }
})

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
