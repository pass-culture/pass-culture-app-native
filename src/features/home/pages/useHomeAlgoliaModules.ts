import { SearchResponse } from '@algolia/client-search'
import { useState } from 'react'
import { GeoCoordinates } from 'react-native-geolocation-service'
import { useQueries } from 'react-query'

import { Offers, OffersWithCover } from 'features/home/contentful'
import { AlgoliaHit, FetchAlgoliaParameters, parseAlgoliaParameters } from 'libs/algolia'
import { fetchAlgolia } from 'libs/algolia/fetchAlgolia'

import { AlgoliaModuleResponse } from '../components/HomeBody.utils'

const isAlgoliaModule = (
  response: unknown
): response is SearchResponse<AlgoliaHit> & { moduleId: string } => {
  return (
    typeof response === 'object' &&
    response !== null &&
    'hits' in response &&
    'nbHits' in response &&
    'moduleId' in response
  )
}

export const useHomeAlgoliaModules = (
  offerModules: Array<Offers | OffersWithCover>,
  position: GeoCoordinates | null
): AlgoliaModuleResponse => {
  const [algoliaModules, setAlgoliaModules] = useState<AlgoliaModuleResponse>({})
  useQueries(
    offerModules.map((module) => {
      const parsedParameters = parseAlgoliaParameters({
        geolocation: position,
        parameters: module.algolia,
      })
      const fetchModule = async () => {
        if (!parsedParameters) return undefined
        const response = await fetchAlgolia<AlgoliaHit>({
          ...parsedParameters,
        } as FetchAlgoliaParameters)
        return { moduleId: module.moduleId, ...response }
      }

      return {
        queryKey: ['algoliaModule', module.moduleId],
        queryFn: fetchModule,
        onSuccess: (data) => {
          if (!isAlgoliaModule(data)) return
          setAlgoliaModules({
            ...algoliaModules,
            [data.moduleId]: { hits: data.hits, nbHits: data.nbHits },
          })
        },
      }
    })
  )
  return algoliaModules
}
