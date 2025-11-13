import { useQuery } from '@tanstack/react-query'

import { fetchCities } from 'libs/place/fetchCities'
import { SuggestedCity } from 'libs/place/types'
import { QueryKeys } from 'libs/queryKeys'

export type CitiesResponse = Array<{
  nom: string
  code: string
  codeDepartement: string
  codeRegion: string
  codesPostaux: string[]
  population: number
}>
type Options = {
  onError?: (error: Error) => void
  onSuccess?: (cities: SuggestedCity[]) => void
}

export const CITIES_API_URL = 'https://geo.api.gouv.fr/communes'

const STALE_TIME_CITIES = 5 * 60 * 1000

export const useCitiesQuery = (postalCode: string, options?: Options) =>
  useQuery({
    queryKey: [QueryKeys.CITIES, postalCode],
    queryFn: () => fetchCities(postalCode),
    staleTime: STALE_TIME_CITIES,
    enabled: postalCode.length >= 5,
    select: (data: CitiesResponse) =>
      data.map(({ nom, code }) => ({
        name: nom,
        code,
        postalCode,
      })) as SuggestedCity[],
    ...options,
  })
