// eslint-disable-next-line no-restricted-imports
import { fetch as fetchNetInfo } from '@react-native-community/netinfo'

import { computeTokenRemainingLifetimeInMs } from 'libs/jwt/jwt'
import { clearRefreshToken, getRefreshToken } from 'libs/keychain/keychain'
import { eventMonitoring } from 'libs/monitoring'
import { storage } from 'libs/storage'

import { ApiError } from './ApiError'
import { DefaultApi } from './gen'
import {
  FAILED_TO_GET_REFRESH_TOKEN_ERROR,
  LIMITED_CONNECTIVITY_WHILE_REFRESHING_ACCESS_TOKEN,
  REFRESH_TOKEN_IS_EXPIRED_ERROR,
  Result,
  UNKNOWN_ERROR_WHILE_REFRESHING_ACCESS_TOKEN,
} from './types'

let refreshedAccessToken: Promise<Result> | null = null

export const removeRefreshedAccessToken = (): void => {
  refreshedAccessToken = null
}

export const scheduleAccessTokenRemoval = (accessToken: string): void => {
  const lifetimeInMs = computeTokenRemainingLifetimeInMs(accessToken)
  setTimeout(removeRefreshedAccessToken, lifetimeInMs)
}

export const refreshAccessToken = async (
  api: DefaultApi,
  remainingRetries = 1
): Promise<Result> => {
  if (!refreshedAccessToken) {
    refreshedAccessToken = refreshAccessTokenWithRetriesOnError(api, remainingRetries).then(
      (result) => {
        if (result.result) {
          scheduleAccessTokenRemoval(result.result)
        }
        return result
      }
    )
  }

  return refreshedAccessToken
}

/**
 * Calls Api to refresh the access token using the in-keychain stored refresh token
 * - on success: Stores the new access token
 * - on error : clear storage propagates error
 */
export const refreshAccessTokenWithRetriesOnError = async (
  api: DefaultApi,
  remainingRetries: number
): Promise<Result> => {
  const refreshToken = await getRefreshToken()
  if (refreshToken == null) {
    await storage.clear('access_token')
    return { error: FAILED_TO_GET_REFRESH_TOKEN_ERROR }
  }

  try {
    const response = await api.postNativeV1RefreshAccessToken({
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    })

    await storage.saveString('access_token', response.accessToken)

    return { result: response.accessToken }
  } catch (error) {
    if (remainingRetries !== 0) {
      return refreshAccessTokenWithRetriesOnError(api, remainingRetries - 1)
    }

    await clearRefreshToken()
    await storage.clear('access_token')

    if (error instanceof ApiError && error.statusCode === 401) {
      return { error: REFRESH_TOKEN_IS_EXPIRED_ERROR }
    }
    const { isInternetReachable } = await fetchNetInfo()
    if (!isInternetReachable) return { error: LIMITED_CONNECTIVITY_WHILE_REFRESHING_ACCESS_TOKEN }

    eventMonitoring.captureException(error)
    return { error: UNKNOWN_ERROR_WHILE_REFRESHING_ACCESS_TOKEN }
  }
}
