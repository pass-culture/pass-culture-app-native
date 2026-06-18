import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { UpdateEmailTokenExpiration } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'
import { CustomQueryOptions } from 'libs/react-query/types'

export const useCheckHasCurrentEmailChangeQuery = <TSelect = UpdateEmailTokenExpiration>(
  options?: CustomQueryOptions<UpdateEmailTokenExpiration, TSelect>
) =>
  useQuery({
    queryKey: [QueryKeys.EMAIL_CHANGE_EXPIRATION_TIMESTAMP],
    queryFn: () => api.getNativeV1ProfileTokenExpiration(),
    ...options,
  })

export const checkHasCurrentEmailChange = (data?: UpdateEmailTokenExpiration): boolean =>
  !!data?.expiration
