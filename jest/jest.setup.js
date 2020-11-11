/* eslint-disable no-undef */
import 'cross-fetch/polyfill'

/* We disable the following warning, which can be safely ignored as the code
  is not executed on a device :
  "Animated: `useNativeDriver` is not supported because the native animated module is missing. 
  Falling back to JS-based animation." */
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')

/* We disable the following warning, which can be safely ignored as the code
  is not executed on a device :
  "Invariant Violation: Native module cannot be null." */
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

/* Cf. the corresponding mock in libs/__mocks__ */
jest.mock('libs/analytics')

jest.mock('libs/environment', () => ({
  env: {
    ENV: 'testing',
    API_BASE_URL: 'http://localhost',
    CONTENTFUL_SPACE_ID: 'contentfulSpaceId',
    CONTENTFUL_ENVIRONMENT: 'environment',
    CONTENTFUL_ACCESS_TOKEN: 'accessToken',
    ALGOLIA_APPLICATION_ID: 'algoliaAppId',
    ALGOLIA_INDEX_NAME: 'algoliaIndexName',
    ALGOLIA_SEARCH_API_KEY: 'algoliaApiKey',
    URL_PREFIX: 'passculture',
    IOS_APP_ID: 'app.ios',
    ANDROID_APP_ID: 'app.android',
  },
}))

const originalWarn = console.warn.bind(console.warn)
console.warn = function (message) {
  const messagesToIgnore = [
    /* React Native is not a real css environment. One of the things it doesn't support is nesting and actually selectors in general
    Source : https://github.com/styled-components/styled-components/issues/989#issuecomment-314946541 */
    'Node of type rule not supported as an inline style',
  ]
  for (messageToIgnore of messagesToIgnore) {
    if (message.includes(messagesToIgnore)) {
      return
    }
  }
  originalWarn(message)
}

const originalError = console.error.bind(console.error)
console.error = function (message) {
  const messagesToIgnore = ['dummy-error']
  for (messageToIgnore of messagesToIgnore) {
    if (message.includes(messagesToIgnore)) {
      return
    }
  }
  originalError(message)
}
