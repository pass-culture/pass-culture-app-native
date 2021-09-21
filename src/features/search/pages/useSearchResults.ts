import { SearchResponse } from '@algolia/client-search'
import flatten from 'lodash.flatten'
import omit from 'lodash.omit'
import { useMemo } from 'react'
import { QueryFunctionContext, useInfiniteQuery } from 'react-query'

import { useIsUserUnderage } from 'features/profile/utils'
import { PartialSearchState } from 'features/search/types'
import { useAvailableCategories } from 'features/search/utils/useAvailableCategories'
import { useGeolocation } from 'libs/geolocation'
import { QueryKeys } from 'libs/queryKeys'
import { SearchHit } from 'libs/search'
import { useAlgoliaQuery } from 'libs/search/fetch/useAlgoliaQuery'
import { useAppSearchBackend } from 'libs/search/fetch/useAppSearchBackend'
import { useSearchQuery } from 'libs/search/fetch/useSearchQuery'
import { useSendAdditionalRequestToAppSearch } from 'libs/search/useSendAdditionalRequestToAppSearch'
import { filterAvailableCategories } from 'libs/search/utils/filterAvailableCategories'

import { useSearch, useStagedSearch } from './SearchWrapper'

export type Response = Pick<SearchResponse<SearchHit>, 'hits' | 'nbHits' | 'page' | 'nbPages'>

const useSearchInfiniteQuery = (searchState: PartialSearchState) => {
  const { enabled, isAppSearchBackend } = useAppSearchBackend()
  const { position } = useGeolocation()
  const algoliaBackend = useAlgoliaQuery()
  const searchBackend = useSearchQuery()
  const availableCategories = useAvailableCategories()
  const sendAdditionalRequest = useSendAdditionalRequestToAppSearch()
  const isUserUnderage = useIsUserUnderage()

  const backend = isAppSearchBackend ? searchBackend : algoliaBackend
  const { fetchHits, transformHits } = backend

  const { data, ...infiniteQuery } = useInfiniteQuery<Response>(
    [QueryKeys.SEARCH_RESULTS, searchState],
    async (context: QueryFunctionContext<[string, PartialSearchState], number>) => {
      const page = context.pageParam || 0
      const searchState = context.queryKey[1]
      const newSearchState = {
        ...searchState,
        offerCategories: filterAvailableCategories(
          searchState.offerCategories,
          availableCategories
        ),
      }
      return await fetchHits({ page, ...newSearchState }, position, isUserUnderage)
    },
    {
      getNextPageParam: ({ page, nbPages }) => (page < nbPages ? page + 1 : undefined),
      enabled,
      onSuccess: sendAdditionalRequest(() =>
        searchBackend.fetchHits({ page: 0, ...searchState }, position, isUserUnderage)
      ),
    }
  )

  const hits: SearchHit[] = useMemo(
    () => flatten(data?.pages.map((page) => page.hits.map(transformHits))),
    [data?.pages]
  )

  const { nbHits } = data?.pages[0] || { nbHits: 0 }

  return { data, hits, nbHits, ...infiniteQuery }
}

export const useStagedSearchResults = () => {
  const { searchState } = useStagedSearch()
  return useSearchInfiniteQuery(omit(searchState, ['showResults']) as PartialSearchState)
}

export const useSearchResults = () => {
  const { searchState } = useSearch()
  return useSearchInfiniteQuery(omit(searchState, ['showResults']) as PartialSearchState)
}
