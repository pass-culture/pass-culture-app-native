import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    omitCredentials?: boolean
    _retryCount?: number
    _lastRequest?: number
  }
  export interface InternalAxiosRequestConfig {
    omitCredentials?: boolean
  }
}
