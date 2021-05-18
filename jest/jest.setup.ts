/* eslint-disable no-undef */
import 'cross-fetch/polyfill'
jest.unmock('react-query')
/* We disable the following warning, which can be safely ignored as the code
  is not executed on a device :
  "Animated: `useNativeDriver` is not supported because the native animated module is missing.
  Falling back to JS-based animation." */
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')

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
  getApplicationName: jest.fn().mockReturnValue('Pass Culture App Native'),
  getUniqueId: jest.fn().mockReturnValue('ad7b7b5a169641e27cadbdb35adad9c4ca23099a'),
}))

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@react-native-community/datetimepicker', () => jest.fn())

jest.mock('jwt-decode', () => () => ({
  // a date in far future to still get a valid token for api calls
  exp: 3454545353,
  user_claims: { user_id: 111 },
}))

jest.mock('features/auth/support.services')

/* Cf. the corresponding mock in libs/__mocks__ */
jest.mock('libs/analytics')

/* No need to actually fetch Firebase's A/B testing config in tests */
jest.mock('libs/ABTesting/ABTesting.services')

/* Flipper only using during manual debbuging */
jest.mock('react-native-flipper')

jest.mock('libs/environment', () => ({
  env: {
    ACCESSIBILITY_LINK: 'https://passculture.accessibility',
    ALGOLIA_APPLICATION_ID: 'algoliaAppId',
    ALGOLIA_INDEX_NAME: 'algoliaIndexName',
    ALGOLIA_SEARCH_API_KEY: 'algoliaApiKey',
    ANDROID_APP_ID: 'app.android',
    API_BASE_URL: 'http://localhost',
    APPS_FLYER_DEV_KEY: 'appsFlyerDevKey',
    CGU_LINK: 'https://passculture.cgu',
    CONTENTFUL_ACCESS_TOKEN: 'accessToken',
    CONTENTFUL_ENVIRONMENT: 'environment',
    CONTENTFUL_SPACE_ID: 'contentfulSpaceId',
    COOKIES_POLICY_LINK: 'https://passculture.cookies',
    DATA_PRIVACY_CHART_LINK: 'https://passculture.data-privacy-chart',
    DOC_CGU_URL:
      'https//docs.passculture.app/textes-normatifs/mentions-legales-et-conditions-generales-dutilisation-de-lapplication-pass-culture',
    DOC_PERSONAL_DATA_URL:
      'https://docs.passculture.app/textes-normatifs/charte-des-donnees-personnelles',
    DSM_URL: '//www.demarches-simplifiees.fr/commencer/inscription-pass-culture',
    ENV: 'testing',
    FAQ_LINK: 'https://passculture.faq',
    FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING: true,
    ID_CHECK_API_URL: 'https://passculture.idcheck',
    ID_CHECK_URL: 'https://id-check-unit-tests',
    IOS_APP_ID: 'app.ios',
    IOS_APP_STORE_ID: 1557887412,
    PRIVACY_POLICY_LINK: 'https://passculture.privacy',
    RECOMMENDATION_ENDPOINT: 'https://recommmendation-endpoint',
    RECOMMENDATION_TOKEN: 'recommmendation-token',
    SITE_KEY: 'SITE_KEY',
    SUPPORT_EMAIL_ADDRESS: 'support@test.passculture.app',
    UNIVERSAL_LINK: 'app.passculture-testing.beta.gouv.fr',
    URL_PREFIX: 'passculture',
  },
}))

jest.mock('features/search/pages/SearchWrapper')

jest.mock('features/favorites/pages/FavoritesWrapper')

jest.mock('../package.json')
jest.mock('api/helpers')

jest.mock('react-native-text-input-mask', () => ({
  default: jest.fn(),
}))
