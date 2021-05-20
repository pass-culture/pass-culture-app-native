import { SearchResponse } from '@algolia/client-search'
import { useEffect, useState } from 'react'
import { useQueries } from 'react-query'

import { Offers, OffersWithCover } from 'features/home/contentful'
import { AlgoliaHit, parseAlgoliaParameters } from 'libs/algolia'
import { fetchAlgolia, filterAlgoliaHit, useTransformAlgoliaHits } from 'libs/algolia/fetchAlgolia'
import { useGeolocation } from 'libs/geolocation'
import { QueryKeys } from 'libs/queryKeys'

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
  const { position } = useGeolocation()
  const [algoliaModules, setAlgoliaModules] = useState<AlgoliaModuleResponse>({})
  const transformAlgoliaHit = useTransformAlgoliaHits()

  const queries = useQueries(
    offerModules.map(({ algolia, moduleId }) => {
      const parsedParameters = parseAlgoliaParameters({
        geolocation: position,
        parameters: algolia,
      })

      const fetchModule = async () => {
        if (!parsedParameters) return undefined
        const response = await fetchAlgolia<AlgoliaHit>(parsedParameters)
        return { moduleId: moduleId, ...response }
      }

      return {
        queryKey: [QueryKeys.ALGOLIA_MODULE, moduleId],
        queryFn: fetchModule,
        onSuccess: (data) => {
          if (isAlgoliaModule(data)) {
            setAlgoliaModules((prevAlgoliaModules) => ({
              ...prevAlgoliaModules,
              [data.moduleId]: {
                hits: data.hits.filter(filterAlgoliaHit).map(transformAlgoliaHit),
                nbHits: data.nbHits,
              },
            }))
          }
        },
      }
    })
  )

  useEffect(() => {
    // When we enable or disable the geolocation, we want to refetch the algolia modules
    queries.forEach(({ refetch }) => {
      refetch()
    })
  }, [!!position])

  return algoliaModules
}
