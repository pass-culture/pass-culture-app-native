import { UseQueryOptions, useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { OauthStateResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

export const useOAuthStateQuery = (
  options?: Omit<UseQueryOptions<unknown, unknown, OauthStateResponse>, 'queryFn' | 'queryKey'>
) =>
  useQuery({
    queryKey: [QueryKeys.OAUTH_STATE],
    queryFn: () => api.getNativeV1OauthState(),
    ...options,
  })
