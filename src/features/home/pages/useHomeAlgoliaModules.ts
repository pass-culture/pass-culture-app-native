import { MultipleQueriesResponse } from '@algolia/client-search'
import flatten from 'lodash.flatten'
import uniqBy from 'lodash.uniqby'
import { useEffect, useState } from 'react'
import { useQueries } from 'react-query'

import { Offers, OffersWithCover } from 'features/home/contentful'
import { AlgoliaHit, parseAlgoliaParameters, ParsedAlgoliaParameters } from 'libs/algolia'
import {
  fetchMultipleAlgolia,
  filterAlgoliaHit,
  useTransformAlgoliaHits,
} from 'libs/algolia/fetchAlgolia'
import { useGeolocation } from 'libs/geolocation'
import { QueryKeys } from 'libs/queryKeys'

export type AlgoliaModuleResponse = {
  [moduleId: string]: {
    hits: AlgoliaHit[]
    nbHits: number
  }
}

const isParsedParameter = (parameter: unknown): parameter is ParsedAlgoliaParameters =>
  typeof parameter === 'object' && parameter !== null

const isMultipleAlgoliaHit = (
  response: unknown
): response is MultipleQueriesResponse<AlgoliaHit> & { moduleId: string } =>
  typeof response === 'object' &&
  response !== null &&
  'results' in response &&
  'moduleId' in response

export const useHomeAlgoliaModules = (
  offerModules: Array<Offers | OffersWithCover>
): AlgoliaModuleResponse => {
  const { position } = useGeolocation()
  const [algoliaModules, setAlgoliaModules] = useState<AlgoliaModuleResponse>({})
  const transformAlgoliaHit = useTransformAlgoliaHits()

  const queries = useQueries(
    offerModules.map(({ algolia, moduleId }) => {
      const parsedParameters = algolia
        .map((parameters) => parseAlgoliaParameters({ geolocation: position, parameters }))
        .filter(isParsedParameter)

      const fetchModule = async () => {
        const response = await fetchMultipleAlgolia(parsedParameters)
        return { moduleId: moduleId, ...response }
      }

      return {
        queryKey: [QueryKeys.ALGOLIA_MODULE, moduleId],
        queryFn: fetchModule,
        onSuccess: (response) => {
          if (isMultipleAlgoliaHit(response)) {
            const hits = flatten(response.results.map(({ hits }) => hits))
            const nbHits = response.results.reduce((prev, curr) => prev + curr.nbHits, 0)

            setAlgoliaModules((prevAlgoliaModules) => ({
              ...prevAlgoliaModules,
              [response.moduleId]: {
                hits: uniqBy(hits.filter(filterAlgoliaHit).map(transformAlgoliaHit), 'objectID'),
                nbHits,
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
