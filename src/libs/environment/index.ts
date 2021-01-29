import Config from '@bam.tech/react-native-config'

import { parseBooleanVariables } from './parseBooleanVariables'

export interface Environment {
  ALGOLIA_APPLICATION_ID: string
  ALGOLIA_INDEX_NAME: string
  ALGOLIA_SEARCH_API_KEY: string
  ANDROID_APP_ID: string
  API_BASE_URL: string
  CGU_LINK: string
  CHEAT_BUTTONS_ENABLED: boolean
  CONTENTFUL_ACCESS_TOKEN: string
  CONTENTFUL_ENVIRONMENT: string
  CONTENTFUL_SPACE_ID: string
  CULTURAL_SURVEY_TYPEFORM_URL: string
  ENABLE_WHY_DID_YOU_RENDER: boolean
  ENV: string
  FEATURE_FLAG_CHEAT_CODES: boolean
  FEATURE_FLAG_CODE_PUSH_MANUAL: boolean
  FEATURE_FLAG_CODE_PUSH: boolean
  ID_CHECK_URL: string
  IOS_APP_ID: string
  PRIVACY_POLICY_LINK: string
  SENTRY_DSN: string
  SIGNIN_IDENTIFIER: string
  SIGNIN_PASSWORD: string
  SUPPORT_EMAIL_ADDRESS: string
  URL_PREFIX: string
  WEBSOCKET_ENDPOINT: string
}

export const env = parseBooleanVariables(Config) as Environment
