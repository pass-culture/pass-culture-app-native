/* eslint-disable no-undef */
import 'cross-fetch/polyfill'
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

/* Links cannot be opened in node.js environment */
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  addEventListener: jest.fn(),
  canOpenURL: jest.fn().mockResolvedValue(true),
  getInitialURL: jest.fn(),
  openSettings: jest.fn(),
  openURL: jest.fn(),
  removeEventListener: jest.fn(),
}))

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('features/auth/helpers/contactSupport')

/* See the corresponding mocks in features/navigation/RootNavigator/__mocks__ */
jest.mock('features/navigation/RootNavigator/routes')
/* See the corresponding mocks in features/navigation/RootNavigator/linking/__mocks__ */
jest.mock('features/navigation/RootNavigator/linking/withAuthProtection')

/* See the corresponding mocks in libs/hooks/__mocks__ */
jest.mock('libs/hooks/useWhiteStatusBar')

/* See the corresponding mocks in libs/firebase/analytics/__mocks__ */
jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/analytics/provider')

jest.mock('libs/appState')

/* See the corresponding mocks in libs/geolocation/__mocks__ */
jest.mock('libs/geolocation/getPosition')
jest.mock('libs/geolocation/requestGeolocPermission')
jest.mock('libs/geolocation/checkGeolocPermission')

/* See the corresponding mocks in libs/itinerary/__mocks__ */
jest.mock('libs/itinerary/useItinerary')

/* See the corresponding mocks in libs/subcategories/__mocks__ */
jest.mock('libs/subcategories/useCategoryId')
jest.mock('libs/subcategories/useSubcategory')

/* See the corresponding mock in libs/firebase/app/__mocks__ */
jest.mock('libs/firebase/shims/app/index.web')

/* See the corresponding mocks in libs/campaign/__mocks__ */
jest.mock('libs/campaign')

/* No need to actually fetch Firebase's remote config in tests */
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

/* Flipper only using during manual debbuging */
jest.mock('react-native-flipper')

/* See the corresponding mock in libs/environment/__mocks__ */
jest.mock('libs/environment/env')

/* See the corresponding mock in libs/amplitude/__mocks__ */
jest.mock('libs/amplitude/amplitude')

jest.mock('libs/react-native-device-info/getUniqueId')

jest.mock('libs/keychain')

/* See the corresponding mock in libs/network/__mocks__ */
jest.mock('libs/network/NetInfoWrapper')

jest.mock('features/search/context/SearchWrapper')

jest.mock('features/favorites/context/FavoritesWrapper')
jest.mock('features/navigation/useGoBack', () =>
  jest.requireActual('features/navigation/__mocks__/useGoBack.ts')
)

jest.mock('libs/jwt')

jest.mock('../package.json')

// Mock files sourced from /public folder (see corresponding /__mock__ folders)
jest.mock('ui/components/ModuleBanner/backgroundImageSource')

// Global mock customFocusOutline because generate console warn "Node of type rule not supported as an inline style"
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

jest.mock('ui/hooks/useEnterKeyAction')

jest.mock('react-native/Libraries/LogBox/LogBox')

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
      this.rlvRef?._scrollComponent?._scrollViewRef?.props.onLayout({
        nativeEvent: { layout: { height: 250, width: 800 } },
      })
    }
  }
  return {
    ...jest.requireActual('@shopify/flash-list'),
    FlashList: MockFlashList,
  }
})
