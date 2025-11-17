import { UseQueryOptions, useQuery } from '@tanstack/react-query'

import { fetchCitiesByPostalCode } from 'libs/place/fetchCitiesByPostalCode'
import { STALE_TIME_CITIES } from 'libs/place/queries/constants'
import { CitiesResponse, SuggestedCity } from 'libs/place/types'
import { QueryKeys } from 'libs/queryKeys'

export const useCitiesByPostalCodeQuery = (
  postalCode: string,
  options?: UseQueryOptions<CitiesResponse, Error, SuggestedCity[]>
) =>
  useQuery({
    queryKey: [QueryKeys.CITIES, postalCode],
    queryFn: () => fetchCitiesByPostalCode(postalCode),
    staleTime: STALE_TIME_CITIES,
    enabled: postalCode.length >= 5,
    select: (data: CitiesResponse) =>
      data.map(({ nom, code, codeDepartement }) => ({
        name: nom,
        code,
        postalCode,
        departementCode: codeDepartement,
      })) as SuggestedCity[],
    ...options,
  })
