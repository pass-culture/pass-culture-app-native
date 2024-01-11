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
          const lifetimeInMs = computeTokenRemainingLifetimeInMs(result.result)
          setTimeout(removeRefreshedAccessToken, lifetimeInMs)
        }
        return result
      }
    )
  }

  return refreshedAccessToken
}
