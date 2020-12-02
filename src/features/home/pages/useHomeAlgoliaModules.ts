import { SearchResponse } from '@algolia/client-search'
import { useState } from 'react'
import { useQueries } from 'react-query'

import { Offers, OffersWithCover } from 'features/home/contentful'
import { AlgoliaHit, parseAlgoliaParameters } from 'libs/algolia'
import { fetchAlgolia } from 'libs/algolia/fetchAlgolia'
import { useGeolocation } from 'libs/geolocation'

export type AlgoliaModuleResponse = {
  [moduleId: string]: {
    hits: AlgoliaHit[]
    nbHits: number
  }
}

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
  offerModules: Array<Offers | OffersWithCover>
): AlgoliaModuleResponse => {
  const geolocation = useGeolocation()
  const [algoliaModules, setAlgoliaModules] = useState<AlgoliaModuleResponse>({})

  useQueries(
    offerModules.map(({ algolia, moduleId }) => {
      const parsedParameters = parseAlgoliaParameters({ geolocation, parameters: algolia })

      const fetchModule = async () => {
        if (!parsedParameters) return undefined
        const response = await fetchAlgolia<AlgoliaHit>(parsedParameters)
        return { moduleId: moduleId, ...response }
      }

      return {
        queryKey: ['algoliaModule', moduleId],
        queryFn: fetchModule,
        onSuccess: (data) => {
          if (isAlgoliaModule(data)) {
            setAlgoliaModules((prevAlgoliaModules) => ({
              ...prevAlgoliaModules,
              [data.moduleId]: {
                hits: data.hits.filter((hit) => !!hit.offer.thumbUrl),
                nbHits: data.nbHits,
              },
            }))
          }
        },
      }
    })
  )

  return algoliaModules
}
