import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { UpdateEmailTokenExpiration } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'
import { CustomQueryOptions } from 'libs/react-query/types'

export const useProfileTokenExpirationQuery = <TSelect = UpdateEmailTokenExpiration>(
  options?: CustomQueryOptions<UpdateEmailTokenExpiration, TSelect>
) => {
  const { isLoggedIn } = useAuthContext()
  return useQuery({
    queryKey: [QueryKeys.EMAIL_CHANGE_EXPIRATION_TIMESTAMP],
    queryFn: () => api.getNativeV1ProfileTokenExpiration(),
    ...options,
    enabled: isLoggedIn && options?.enabled,
    meta: { private: true },
  })
}

export const checkHasCurrentEmailChange = (data?: UpdateEmailTokenExpiration): boolean =>
  !!data?.expiration
