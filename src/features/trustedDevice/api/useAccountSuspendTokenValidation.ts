import { UseQueryResult, useQuery } from 'react-query'

import { api } from 'api/api'
import { ApiError } from 'api/apiHelpers'
import { QueryKeys } from 'libs/queryKeys'

export enum AccountSecurityStatus {
  VALID_TOKEN,
  INVALID_TOKEN,
  EXPIRED_TOKEN,
}

export const useAccountSuspendTokenValidation = (
  token: string
): UseQueryResult<AccountSecurityStatus, ApiError> => {
  return useQuery(
    [QueryKeys.ACCOUNT_SUSPEND_TOKEN_VALIDATION, token],
    async () => {
      try {
        await api.getNativeV1AccountSuspendTokenValidationtoken(token)
        return AccountSecurityStatus.VALID_TOKEN
      } catch (error) {
        if (error instanceof ApiError && error.statusCode === 400)
          return AccountSecurityStatus.INVALID_TOKEN

        if (error instanceof ApiError && error.statusCode === 401)
          return AccountSecurityStatus.EXPIRED_TOKEN

        throw error
      }
    },
    {
      useErrorBoundary: true,
      retry: false,
    }
  )
}
