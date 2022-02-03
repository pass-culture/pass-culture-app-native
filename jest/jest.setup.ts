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
  openURL: jest.fn(),
  removeEventListener: jest.fn(),
}))

jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn().mockReturnValue('1.0'),
  getApplicationName: jest.fn().mockReturnValue('pass Culture App Native'),
  getUniqueId: jest.fn().mockReturnValue('ad7b7b5a169641e27cadbdb35adad9c4ca23099a'),
}))

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('jwt-decode', () => () => ({
  // a date in far future to still get a valid token for api calls
  exp: 3454545353,
  user_claims: { user_id: 111 },
}))

jest.mock('features/auth/support.services')

/* See the corresponding mocks in features/navigation/RootNavigator/__mocks__ */
jest.mock('features/navigation/RootNavigator/routes')
/* See the corresponding mocks in features/navigation/RootNavigator/linking/__mocks__ */
jest.mock('features/navigation/RootNavigator/linking/withAuthProtection')

/* See the corresponding mocks in libs/analytics/__mocks__ */
jest.mock('libs/analytics/analytics')
jest.mock('libs/analytics/provider')

jest.mock('libs/appState')

/* See the corresponding mocks in libs/geolocation/__mocks__ */
jest.mock('libs/geolocation/getPosition')
jest.mock('libs/geolocation/requestGeolocPermission')
jest.mock('libs/geolocation/checkGeolocPermission')

/* See the corresponding mocks in libs/subcategories/__mocks__ */
jest.mock('libs/subcategories/mappings')
jest.mock('libs/subcategories/useCategoryId')
jest.mock('libs/subcategories/useSubcategory')

/* See the corresponding mock in libs/firebase/__mocks__ */
jest.mock('libs/firebase/firebase')

/* See the corresponding mocks in libs/campaign/__mocks__ */
jest.mock('libs/campaign')

/* No need to actually fetch Firebase's A/B testing config in tests */
jest.mock('libs/ABTesting/ABTesting.services')

/* Flipper only using during manual debbuging */
jest.mock('react-native-flipper')

/* See the corresponding mock in libs/environment/__mocks__ */
jest.mock('libs/environment/env')

/* See the corresponding mock in libs/amplitude/__mocks__ */
jest.mock('libs/amplitude/amplitude')

jest.mock('features/search/pages/SearchWrapper')

jest.mock('features/favorites/pages/FavoritesWrapper')
jest.mock('features/navigation/useGoBack', () =>
  jest.requireActual('features/navigation/__mocks__/useGoBack.ts')
)

jest.mock('../package.json')
jest.mock('api/apiHelpers')

// Mock files sourced from /public folder (see corresponding /__mock__ folders)
jest.mock('ui/components/ModuleBanner/backgroundImageSource')

jest.mock('ui/hooks/useEnterKeyAction')

jest.mock('react-native/Libraries/LogBox/LogBox')

jest.mock('@bam.tech/react-native-batch', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('libs/react-native-batch', () => jest.requireActual('__mocks__/libs/react-native-batch'))

jest.unmock('react-native-modal')
