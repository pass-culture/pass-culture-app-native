import { Environment } from '../types'

export const env: Environment = {
  __DEV__: true,
  REGION: 'europe-west1',
  ENV: 'test',
  APP_PUBLIC_URL: 'http://localhost:8080',
  APP_BUCKET_URL: 'https://app-bucket.testing.passculture.team',
  API_BASE_URL: 'https://backend.testing.passculture.team',
  API_BASE_PATH_NATIVE_V1: 'native/v1',
  DEEPLINK_PROTOCOL: 'passculture://',
  PROXY_CACHE_CONTROL: 'public,max-age=3600',
  ORGANIZATION_PREFIX: 'pass Culture',
}
