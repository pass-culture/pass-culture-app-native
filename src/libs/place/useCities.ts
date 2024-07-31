import { useQuery } from 'react-query'

import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
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

export const useCities = (postalCode: string, options?: Options) => {
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
    onError: options?.onError,
    onSuccess: options?.onSuccess,
  })
}
