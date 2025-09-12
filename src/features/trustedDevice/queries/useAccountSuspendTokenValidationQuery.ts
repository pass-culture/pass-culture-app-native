import { UseQueryResult, useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'
import { QueryKeys } from 'libs/queryKeys'

export enum AccountSecurityStatus {
  VALID_TOKEN,
  INVALID_TOKEN,
  EXPIRED_TOKEN,
}

export const useAccountSuspendTokenValidationQuery = (
  token: string
): UseQueryResult<AccountSecurityStatus, ApiError> =>
  useQuery({
    queryKey: [QueryKeys.ACCOUNT_SUSPEND_TOKEN_VALIDATION, token],

    queryFn: async () => {
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

    throwOnError: true,
    retry: false,
  })
