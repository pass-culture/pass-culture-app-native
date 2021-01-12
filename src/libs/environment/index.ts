import Config from '@bam.tech/react-native-config'

import { parseBooleanVariables } from './parseBooleanVariables'

export interface Environment {
  API_BASE_URL: string
  ENV: string
  CHEAT_BUTTONS_ENABLED: boolean
  FEATURE_FLAG_CHEAT_CODES: boolean
  FEATURE_FLAG_CODE_PUSH: boolean
  FEATURE_FLAG_CODE_PUSH_MANUAL: boolean
  SENTRY_DSN: string
  SIGNIN_IDENTIFIER: string
  SIGNIN_PASSWORD: string
  WEBSOCKET_ENDPOINT: string
  CONTENTFUL_ACCESS_TOKEN: string
  CONTENTFUL_ENVIRONMENT: string
  CONTENTFUL_SPACE_ID: string
  URL_PREFIX: string
  ANDROID_APP_ID: string
  IOS_APP_ID: string
  ALGOLIA_APPLICATION_ID: string
  ALGOLIA_SEARCH_API_KEY: string
  ALGOLIA_INDEX_NAME: string
  ENABLE_WHY_DID_YOU_RENDER: boolean
  SUPPORT_EMAIL_ADDRESS: string
  CGU_LINK: string
  PRIVACY_POLICY_LINK: string
  ID_CHECK_URL: string
  RECAPTCHA_SITE_KEY: string
}

export const env = parseBooleanVariables(Config) as Environment
