import { queryOptions } from '@tanstack/react-query'

import { api } from 'api/api'
import { ApiError } from 'api/ApiError'

export enum AccountSecurityStatus {
  VALID_TOKEN,
  INVALID_TOKEN,
  EXPIRED_TOKEN,
}

export const accountQueries = {
  suspendTokenValidation: (token: string) =>
    queryOptions({
      queryKey: ['accountSuspendTokenValidation', token] as const,

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
    }),

  suspensionDate: () =>
    queryOptions({
      queryKey: ['suspensionDate'] as const,
      queryFn: async () => {
        try {
          return await api.getNativeV1AccountSuspensionDate()
        } catch {
          return null
        }
      },
    }),

  suspensionStatus: () =>
    queryOptions({
      queryKey: ['suspensionStatus'] as const,
      queryFn: async () => {
        try {
          return await api.getNativeV1AccountSuspensionStatus()
        } catch {
          return null
        }
      },
    }),
}
