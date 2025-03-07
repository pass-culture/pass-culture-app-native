import { UseQueryOptions, useQuery } from 'react-query'

import { api } from 'api/api'
import { OauthStateResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

export function useOAuthStateQuery(
  options?: Omit<UseQueryOptions<unknown, unknown, OauthStateResponse>, 'queryFn' | 'queryKey'>
) {
  return useQuery([QueryKeys.OAUTH_STATE], () => api.getNativeV1OauthState(), options)
}
