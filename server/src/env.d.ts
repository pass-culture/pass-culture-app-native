declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      ENV: 'production' | 'testing' | 'staging'
      APP_PUBLIC_URL: string
      APP_BUCKET_URL: string
      API_BASE_URL: string
      DEEPLINK_PROTOCOL: string
      PROXY_CACHE_CONTROL: string
      ORGANIZATION_PREFIX: string
    }
  }
}

export {}
