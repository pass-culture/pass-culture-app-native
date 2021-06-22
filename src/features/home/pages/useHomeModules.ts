import { MultipleQueriesResponse } from '@algolia/client-search'
import flatten from 'lodash.flatten'
import uniqBy from 'lodash.uniqby'
import { useEffect, useState } from 'react'
import { useQueries } from 'react-query'

import { Offers, OffersWithCover } from 'features/home/contentful'
import { useGeolocation } from 'libs/geolocation'
import { QueryKeys } from 'libs/queryKeys'
import {
  SearchHit,
  parseAlgoliaParameters,
  ParsedAlgoliaParameters,
  fetchMultipleHits,
  filterAlgoliaHit,
  useTransformHits,
} from 'libs/search'

export type HomeModuleResponse = {
  [moduleId: string]: {
    hits: SearchHit[]
    nbHits: number
  }
}

const isParsedParameter = (parameter: unknown): parameter is ParsedAlgoliaParameters =>
  typeof parameter === 'object' && parameter !== null

const isMultipleAlgoliaHit = (
  response: unknown
): response is MultipleQueriesResponse<SearchHit> & { moduleId: string } =>
  typeof response === 'object' &&
  response !== null &&
  'results' in response &&
  'moduleId' in response

export const useHomeModules = (
  offerModules: Array<Offers | OffersWithCover>
): HomeModuleResponse => {
  const { position } = useGeolocation()
  const [homeModules, setHomeModules] = useState<HomeModuleResponse>({})
  const transformHits = useTransformHits()

  const queries = useQueries(
    offerModules.map(({ algolia, moduleId }) => {
      const parsedParameters = algolia
        .map((parameters) => parseAlgoliaParameters({ geolocation: position, parameters }))
        .filter(isParsedParameter)

      const fetchModule = async () => {
        const response = await fetchMultipleHits(parsedParameters)
        return { moduleId: moduleId, ...response }
      }

      return {
        queryKey: [QueryKeys.HOME_MODULE, moduleId],
        queryFn: fetchModule,
        onSuccess: (response) => {
          if (isMultipleAlgoliaHit(response)) {
            const hits = flatten(response.results.map(({ hits }) => hits))
            const nbHits = response.results.reduce((prev, curr) => prev + curr.nbHits, 0)

            setHomeModules((prevHomeModules) => ({
              ...prevHomeModules,
              [response.moduleId]: {
                hits: uniqBy(hits.filter(filterAlgoliaHit).map(transformHits), 'objectID'),
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

  return homeModules
}
