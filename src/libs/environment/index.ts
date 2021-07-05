import Config from '@bam.tech/react-native-config'

import { parseBooleanVariables } from './parseBooleanVariables'

export interface Environment {
  ACCESSIBILITY_LINK: string
  ALGOLIA_APPLICATION_ID: string
  ALGOLIA_INDEX_NAME: string
  ALGOLIA_SEARCH_API_KEY: string
  ANDROID_APP_ID: string
  API_BASE_URL: string
  APPS_FLYER_DEV_KEY: string
  APP_SEARCH_KEY: string
  APP_SEARCH_ENDPOINT: string
  CGU_LINK: string
  CONTENTFUL_ACCESS_TOKEN: string
  CONTENTFUL_ENVIRONMENT: string
  CONTENTFUL_SPACE_ID: string
  COOKIES_POLICY_LINK: string
  CULTURAL_SURVEY_TYPEFORM_URL: string
  DATA_PRIVACY_CHART_LINK: string
  DOC_CGU_URL: string
  DOC_PERSONAL_DATA_URL: string
  DSM_URL: string
  ENABLE_WHY_DID_YOU_RENDER: boolean
  ENV: string
  FAQ_LINK: string
  FEATURE_FLIPPING_ONLY_VISIBLE_ON_TESTING: boolean
  FIREBASE_DYNAMIC_LINK: string
  ID_CHECK_API_URL: string
  ID_CHECK_URL: string
  IOS_APP_ID: string
  IOS_APP_STORE_ID: string
  PRIVACY_POLICY_LINK: string
  RECOMMENDATION_ENDPOINT: string
  RECOMMENDATION_TOKEN: string
  SENTRY_DSN: string
  SIGNIN_IDENTIFIER: string
  SIGNIN_PASSWORD: string
  SIGNUP_DATE: string
  SIGNUP_POSTAL_CODE: string
  SIGNUP_RANDOM_EMAIL: boolean
  SIGNUP_RANDOM_PASSWORD: boolean
  SITE_KEY: string
  SUPPORT_EMAIL_ADDRESS: string
  UNIVERSAL_LINK: string
  URL_PREFIX: string
  WEBAPP_URL: string
  WEBSOCKET_ENDPOINT: string
}

export const env = parseBooleanVariables(Config) as Environment
