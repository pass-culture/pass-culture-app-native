import { Environment } from '../types'

export const env: Environment = {
  ENV: 'test',
  APP_PUBLIC_URL: 'http://localhost:8080',
  APP_PROXY_URL: 'https://app-proxy.testing.passculture.team',
  API_BASE_URL: 'https://api.testing.passculture.team',
  API_BASE_PATH_NATIVE_V1: 'native/v1',
  DEEPLINK_PROTOCOL: 'passculture://',
  PROXY_CACHE_CONTROL: 'public,max-age=3600',
}
