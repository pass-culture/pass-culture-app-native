import { MultipleQueriesResponse } from '@algolia/client-search'
import flatten from 'lodash.flatten'
import uniqBy from 'lodash.uniqby'
import { useEffect } from 'react'
import { useQueries } from 'react-query'

import { Offers, OffersWithCover } from 'features/home/contentful'
import { SearchState } from 'features/search/types'
import { useGeolocation } from 'libs/geolocation'
import { QueryKeys } from 'libs/queryKeys'
import { SearchHit, useParseSearchParameters } from 'libs/search'
import { useAlgoliaMultipleHits } from 'libs/search/fetch/useAlgoliaMultipleHits'
import { useAppSearchBackend } from 'libs/search/fetch/useAppSearchBackend'
import { useSearchMultipleHits } from 'libs/search/fetch/useSearchMultipleHits'
import { useSendAdditionalRequestToAppSearch } from 'libs/search/useSendAdditionalRequestToAppSearch'

export type HomeModuleResponse = {
  [moduleId: string]: {
    hits: SearchHit[]
    nbHits: number
  }
}

const isSearchState = (parameter: unknown): parameter is SearchState =>
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
  const homeModules: HomeModuleResponse = {}
  const { enabled, isAppSearchBackend } = useAppSearchBackend()
  const algoliaBackend = useAlgoliaMultipleHits()
  const searchBackend = useSearchMultipleHits()
  const parseSearchParameters = useParseSearchParameters()
  const sendAdditionalRequest = useSendAdditionalRequestToAppSearch()

  const backend = isAppSearchBackend ? searchBackend : algoliaBackend
  const { fetchMultipleHits, filterHits, transformHits } = backend

  const queries = useQueries(
    offerModules.map(({ search, moduleId }) => {
      const parsedParameters = search.map(parseSearchParameters).filter(isSearchState)

      const fetchModule = async () => {
        const response = await fetchMultipleHits(parsedParameters, position)
        return { moduleId: moduleId, ...response }
      }

      return {
        queryKey: [QueryKeys.HOME_MODULE, moduleId],
        queryFn: fetchModule,
        onSettled: sendAdditionalRequest(() =>
          searchBackend.fetchMultipleHits(parsedParameters, position)
        ),
        enabled,
        notifyOnChangeProps: ['data'],
      }
    })
  )

  queries.forEach((query) => {
    let hits: SearchHit[] = []
    let nbHits = 0

    if (!query.isSuccess) return

    const data = query.data
    if (isMultipleAlgoliaHit(data)) {
      hits = flatten(data.results.map(({ hits }) => hits))
      nbHits = data.results.reduce((prev, curr) => prev + curr.nbHits, 0)
    } else if (isMultipleSearchHit(data)) {
      hits = data.hits
      nbHits = data.nbHits
    } else {
      return
    }

    homeModules[data.moduleId] = {
      hits: uniqBy(hits.filter(filterHits).map(transformHits), 'objectID'),
      nbHits,
    }
  })

  useEffect(() => {
    // When we enable or disable the geolocation, we want to refetch the home modules
    queries.forEach(({ refetch }) => {
      refetch()
    })
  }, [!!position])

  return homeModules
}
