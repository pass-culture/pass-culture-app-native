import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { analytics } from 'libs/analytics/provider'
import { QueryKeys } from 'libs/queryKeys'

export const useResetPasswordExpiredLinkQuery = (email: string) =>
  useQuery({
    queryKey: [QueryKeys.RESET_PASSWORD_EXPIRED_LINK],
    queryFn: () => {
      void analytics.logResendEmailResetPasswordExpiredLink()
      return api.postNativeV1RequestPasswordReset({ email })
    },
    gcTime: 0,
    enabled: false,
    retry: (failureCount) => failureCount <= 1,
  })
