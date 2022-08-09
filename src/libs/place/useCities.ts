import { useQuery } from 'react-query'

import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
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

export const useCities = (postalCode: string) => {
  const netInfo = useNetInfoContext()
  return useQuery([QueryKeys.CITIES, postalCode], () => fetchCities(postalCode), {
    staleTime: STALE_TIME_CITIES,
    enabled: !!netInfo.isConnected && postalCode.length >= 5,
    select: (data: CitiesResponse) =>
      data.map(({ nom, code }) => ({
        name: nom,
        code,
        postalCode,
      })) as SuggestedCity[],
  })
}
