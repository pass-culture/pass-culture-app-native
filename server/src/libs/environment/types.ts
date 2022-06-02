export interface EnvConfig {
  [name: string]: string | undefined
}

export interface Environment {
  __DEV__: boolean
  ENV: string
  REGION: string
  APP_PUBLIC_URL: string
  APP_BUCKET_URL: string
  API_BASE_URL: string
  API_BASE_PATH_NATIVE_V1: string
  DEEPLINK_PROTOCOL: string
  PROXY_CACHE_CONTROL: string
}
