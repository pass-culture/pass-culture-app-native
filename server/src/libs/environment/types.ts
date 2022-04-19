export interface EnvConfig {
  [name: string]: string | undefined
}

export interface Environment {
  __DEV__: boolean
  ENV: string
  REGION:
    | 'us-central1'
    | 'us-east1'
    | 'us-east4'
    | 'europe-west1'
    | 'europe-west2'
    | 'asia-east1'
    | 'asia-east2'
    | 'asia-northeast1'
    | 'asia-northeast2'
    | 'us-west2'
    | 'us-west3'
    | 'us-west4'
    | 'northamerica-northeast1'
    | 'southamerica-east1'
    | 'europe-west3'
    | 'europe-west6'
    | 'europe-central2'
    | 'australia-southeast1'
    | 'asia-south1'
    | 'asia-southeast1'
    | 'asia-southeast2'
    | 'asia-northeast3'
  APP_PUBLIC_URL: string
  APP_PROXY_URL: string
  API_BASE_URL: string
  API_BASE_PATH_NATIVE_V1: string
  DEEPLINK_PROTOCOL: string
  PROXY_CACHE_CONTROL: string
}
