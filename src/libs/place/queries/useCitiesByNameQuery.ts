import { UseQueryOptions, useQuery } from '@tanstack/react-query'

import { fetchCitiesByName } from 'libs/place/fetchCitiesByName'
import { STALE_TIME_CITIES } from 'libs/place/queries/constants'
import { CitiesResponse, SuggestedCity } from 'libs/place/types'
import { QueryKeys } from 'libs/queryKeys'

export const useCitiesByNameQuery = (
  name: string,
  options?: UseQueryOptions<CitiesResponse, Error, SuggestedCity[]>
) =>
  useQuery({
    queryKey: [QueryKeys.CITIES, name],
    queryFn: () => fetchCitiesByName(name),
    staleTime: STALE_TIME_CITIES,
    enabled: name.length >= 1,
    select: (data: CitiesResponse) =>
      data.map(({ nom, code, codeDepartement, codesPostaux }) => ({
        name: nom,
        code,
        postalCode: codesPostaux[0], // For the bonification feature it will not be relevant
        departementCode: codeDepartement,
      })) as SuggestedCity[],
    ...options,
  })
