import Config from '@bam.tech/react-native-config'

import { parseBooleanVariables } from './parseBooleanVariables'

export interface Environment {
  ALGOLIA_APPLICATION_ID: string
  ALGOLIA_INDEX_NAME: string
  ALGOLIA_SEARCH_API_KEY: string
  ANDROID_APP_ID: string
  API_BASE_URL: string
  CGU_LINK: string
  CONTENTFUL_ACCESS_TOKEN: string
  CONTENTFUL_ENVIRONMENT: string
  CONTENTFUL_SPACE_ID: string
  CULTURAL_SURVEY_TYPEFORM_URL: string
  ENABLE_WHY_DID_YOU_RENDER: boolean
  ENV: string
  FEATURE_FLAG_CODE_PUSH: boolean
  ID_CHECK_URL: string
  IOS_APP_ID: string
  PRIVACY_POLICY_LINK: string
  COOKIES_POLICY_LINK: string
  RECOMMENDATION_ENDPOINT: string
  RECOMMENDATION_TOKEN: string
  SENTRY_DSN: string
  SIGNIN_IDENTIFIER: string
  SIGNIN_PASSWORD: string
  SITE_KEY: string
  SUPPORT_EMAIL_ADDRESS: string
  UNIVERSAL_LINK: string
  URL_PREFIX: string
  WEBAPP_URL: string
  WEBSOCKET_ENDPOINT: string
  FEATURE_FLIPPING_ONLY_TESTING: boolean
  SHOULD_DISPLAY_BOOKINGS_TAB: boolean
  SHOULD_DISPLAY_FAVORITES_FILTER: boolean
}

export const env = parseBooleanVariables(Config) as Environment
