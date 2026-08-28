import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import { postNativeV2RefreshAccessToken } from 'api/v2/requests'
import { tokenActions, tokenSelectors } from 'features/auth/store/token.store'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { env } from 'libs/environment/env'
import { deviceInfoStoreSelectors } from 'shared/store/deviceInfoStore'

type ClientConfiguration = {
  baseURL: string
}
const configuration: ClientConfiguration = {
  baseURL: env.API_BASE_URL,
}

const apiClient = axios.create(configuration)
const MAX_RETRY_ATTEMPTS = 1 // Set a fixed number of retry attempts
const MIN_INTERVAL = 2000 // at most one request every 2 seconds

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: string | null) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.omitCredentials) {
      return config
    }

    const accessToken = tokenSelectors.selectAccess()
    if (!accessToken) {
      // TODO(PC-00000): si pas d'access -> refresh -> si pas refresh login
      return config
    }
    config.headers.Authorization = `Bearer ${accessToken}`
    return config
  },
  (error) => {
    // TODO(PC-00000): display message error network, call not send
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosResponse) => {
    if (error.status === 401) {
      // if 401 and public route reject response
      if (!error.config.headers.Authorization) {
        return Promise.reject(error)
      }
      const originalRequest = error.config

      if (!originalRequest._retryCount) {
        originalRequest._retryCount = 0
      }
      if (isRefreshing && !originalRequest._retryCount) {
        try {
          const token = await new Promise<string | null>((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })

          if (originalRequest.headers && !!token) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }

          return apiClient(originalRequest)
        } catch (err) {
          return Promise.reject(err)
        }
      }

      if (originalRequest._retryCount < MAX_RETRY_ATTEMPTS) {
        isRefreshing = true
        // Refresh access token
        const refreshToken = tokenSelectors.selectRefresh()
        if (!refreshToken) {
          // TODO(PC-00000): si pas refresh -> login
          navigateFromRef('LoginMethods')
          return apiClient(originalRequest)
        }
        const refreshResponse = await postNativeV2RefreshAccessToken(
          { deviceInfo: deviceInfoStoreSelectors.selectDeviceInfo() },
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        )
        tokenActions.setAccess(refreshResponse.accessToken)
        tokenActions.setRefresh(refreshResponse.refreshToken)

        // Retry the original request
        error.config.headers.Authorization = `Bearer ${refreshResponse.accessToken}`
        originalRequest._retryCount += 1
        processQueue(null, refreshResponse.accessToken)
        return apiClient(originalRequest)
      }

      processQueue(error, null)
      navigateFromRef('LoginMethods')
    }
    if (error.status === 403) {
      const bannedCountry = error.headers['x-country-ban']
      if (bannedCountry) {
        navigateFromRef('BannedCountryError')
        return {}
      }
      navigateFromRef('AccountStatusScreenHandler')
      return {}
    }
    if (error.status === 404) {
      console.error('Resource not found:', error.config.url)
    }
    if ([502, 503, 504].includes(error.status)) {
      // rate limit when server is down
      const now = Date.now()
      const config = error.config

      if (!config._lastRequest) {
        config._lastRequest = now
      }
      const wait = Math.max(0, config._lastRequest + MIN_INTERVAL - now)

      config._lastRequest += wait
      return new Promise((resolve) => setTimeout(() => resolve(config), wait))
    }
    return Promise.reject(error)
  }
)

export default apiClient
