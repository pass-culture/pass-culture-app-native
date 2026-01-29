import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { STALE_TIME_COUNTRIES } from 'libs/place/queries/constants'
import { QueryKeys } from 'libs/queryKeys'

export const useCountriesQuery = () =>
  useQuery({
    queryKey: [QueryKeys.COUNTRIES_INSEE],
    queryFn: () => api.getNativeV1Countries(),
    staleTime: STALE_TIME_COUNTRIES,
  })
