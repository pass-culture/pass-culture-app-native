import { useQuery } from 'react-query'

import { SuggestedCity } from 'libs/place'
import { fetchCities } from 'libs/place/fetchCities'
import { QueryKeys } from 'libs/queryKeys'

export type CitiesResponse = Array<{
  nom: string
  code: string
  codeDepartement: string
  codeRegion: string
  codesPostaux: string[]
  population: number
}>

export const CITIES_API_URL = 'https://geo.api.gouv.fr/communes'

const STALE_TIME_CITIES = 5 * 60 * 1000

export const useCities = (postalCode: string) =>
  useQuery([QueryKeys.CITIES, postalCode], () => fetchCities(postalCode), {
    staleTime: STALE_TIME_CITIES,
    cacheTime: 0,
    enabled: false,
    select: (data: CitiesResponse) =>
      data.map(({ nom, code }) => ({
        name: nom,
        code,
        postalCode,
      })) as SuggestedCity[],
  })
