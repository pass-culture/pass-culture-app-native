import { computeTokenRemainingLifetimeInMs } from 'libs/jwt'

import { DefaultApi } from './gen'
import { refreshAccessTokenWithRetriesOnError } from './refreshAccessTokenWithRetriesOnError'
import { Result } from './types'

let refreshedAccessToken: Promise<Result> | null = null

export const removeRefreshedAccessToken = (): void => {
  refreshedAccessToken = null
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

export const scheduleAccessTokenRemoval = (accessToken: string): void => {
  const lifetimeInMs = computeTokenRemainingLifetimeInMs(accessToken)
  setTimeout(removeRefreshedAccessToken, lifetimeInMs)
}
