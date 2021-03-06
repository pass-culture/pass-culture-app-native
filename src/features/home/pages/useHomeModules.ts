import { MultipleQueriesResponse } from '@algolia/client-search'
import flatten from 'lodash.flatten'
import uniqBy from 'lodash.uniqby'
import { useEffect, useState } from 'react'
import { useQueries } from 'react-query'

import { Offers, OffersWithCover } from 'features/home/contentful'
import { SearchParameters } from 'features/search/types'
import { useGeolocation } from 'libs/geolocation'
import { QueryKeys } from 'libs/queryKeys'
import { SearchHit, parseSearchParameters, useFetchMultipleHits } from 'libs/search'

export type HomeModuleResponse = {
  [moduleId: string]: {
    hits: SearchHit[]
    nbHits: number
  }
}

const isParsedParameter = (parameter: unknown): parameter is SearchParameters =>
  typeof parameter === 'object' && parameter !== null

const isMultipleAlgoliaHit = (
  response: unknown
): response is MultipleQueriesResponse<SearchHit> & { moduleId: string } =>
  typeof response === 'object' &&
  response !== null &&
  'results' in response &&
  'moduleId' in response

const isMultipleSearchHit = (
  response: unknown
): response is { hits: SearchHit[]; moduleId: string; nbHits: number } =>
  typeof response === 'object' && response !== null && 'hits' in response && 'moduleId' in response

export const useHomeModules = (
  offerModules: Array<Offers | OffersWithCover>
): HomeModuleResponse => {
  const { position } = useGeolocation()
  const [homeModules, setHomeModules] = useState<HomeModuleResponse>({})
  const { enabled, fetchMultipleHits, filterHits, transformHits } = useFetchMultipleHits()

  const queries = useQueries(
    offerModules.map(({ search, moduleId }) => {
      const parsedParameters = search
        .map((parameters) => parseSearchParameters({ geolocation: position, parameters }))
        .filter(isParsedParameter)

      const fetchModule = async () => {
        const response = await fetchMultipleHits(parsedParameters)
        return { moduleId: moduleId, ...response }
      }

      return {
        queryKey: [QueryKeys.HOME_MODULE, moduleId],
        queryFn: fetchModule,
        onSuccess: (response) => {
          let hits: SearchHit[] = []
          let nbHits = 0

          if (isMultipleAlgoliaHit(response)) {
            hits = flatten(response.results.map(({ hits }) => hits))
            nbHits = response.results.reduce((prev, curr) => prev + curr.nbHits, 0)
          } else if (isMultipleSearchHit(response)) {
            hits = response.hits
            nbHits = response.nbHits
          } else {
            return
          }

          setHomeModules((prevHomeModules) => ({
            ...prevHomeModules,
            [response.moduleId]: {
              hits: uniqBy(hits.filter(filterHits).map(transformHits), 'objectID'),
              nbHits,
            },
          }))
        },
        enabled,
      }
    })
  )

  useEffect(() => {
    // When we enable or disable the geolocation, we want to refetch the home modules
    queries.forEach(({ refetch }) => {
      refetch()
    })
  }, [!!position])

  return homeModules
}
