import { clearRefreshToken, getRefreshToken } from 'libs/keychain'
import { eventMonitoring } from 'libs/monitoring'
import { storage } from 'libs/storage'

import { ApiError } from './ApiError'
import { DefaultApi } from './gen'
import {
  REFRESH_TOKEN_IS_EXPIRED_ERROR,
  FAILED_TO_GET_REFRESH_TOKEN_ERROR,
  UNKNOWN_ERROR_WHILE_REFRESHING_ACCESS_TOKEN,
  Result,
} from './types'

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

    eventMonitoring.captureException(error)
    return { error: UNKNOWN_ERROR_WHILE_REFRESHING_ACCESS_TOKEN }
  }
}
