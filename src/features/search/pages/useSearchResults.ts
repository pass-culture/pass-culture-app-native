import { SearchResponse } from '@algolia/client-search'
import flatten from 'lodash.flatten'
import { useMemo } from 'react'
import { QueryFunctionContext, useInfiniteQuery } from 'react-query'

import { OptionalCategoryCriteria } from 'features/search/enums'
import { SearchState } from 'features/search/types'
import { useAvailableCategories } from 'features/search/utils/useAvailableCategories'
import { useGeolocation } from 'libs/geolocation'
import { QueryKeys } from 'libs/queryKeys'
import { SearchHit } from 'libs/search'
import { useAlgoliaQuery } from 'libs/search/fetch/useAlgoliaQuery'
import { useAppSearchBackend } from 'libs/search/fetch/useAppSearchBackend'
import { useSearchQuery } from 'libs/search/fetch/useSearchQuery'
import { useSendAdditionalRequestToAppSearch } from 'libs/search/useSendAdditionalRequestToAppSearch'

import { useSearch, useStagedSearch } from './SearchWrapper'

export type Response = Pick<SearchResponse<SearchHit>, 'hits' | 'nbHits' | 'page' | 'nbPages'>

// TODO(anoukhello) use parseSearchParams function to filter available categories
function filterAvailableCategories(
  searchState: SearchState,
  availableCategories: OptionalCategoryCriteria
) {
  const { offerCategories } = searchState
  // if no category is selected, fill this field with available categories
  if (offerCategories.length === 0) {
    const categoryFacets = Object.values(availableCategories).map(
      (category) => category.facetFilter
    )
    return { ...searchState, ...{ offerCategories: categoryFacets } }
  }
  const categoryFacets = offerCategories.filter((category) => category in availableCategories)
  return { ...searchState, offerCategories: categoryFacets }
}

const useSearchInfiniteQuery = (searchState: SearchState) => {
  const { enabled, isAppSearchBackend } = useAppSearchBackend()
  const { position } = useGeolocation()
  const algoliaBackend = useAlgoliaQuery()
  const searchBackend = useSearchQuery()
  const availableCategories = useAvailableCategories()
  const sendAdditionalRequest = useSendAdditionalRequestToAppSearch()

  const backend = isAppSearchBackend ? searchBackend : algoliaBackend
  const { fetchHits, transformHits } = backend

  const { data, ...infiniteQuery } = useInfiniteQuery<Response>(
    [QueryKeys.SEARCH_RESULTS, searchState],
    async (context: QueryFunctionContext<[string, SearchState], number>) => {
      const page = context.pageParam || 0
      const searchState = filterAvailableCategories(context.queryKey[1], availableCategories)
      return await fetchHits({ page, ...searchState }, position)
    },
    {
      getNextPageParam: ({ page, nbPages }) => (page < nbPages ? page + 1 : undefined),
      enabled,
      onSettled: sendAdditionalRequest(() =>
        searchBackend.fetchHits({ page: 0, ...searchState }, position)
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
  return useSearchInfiniteQuery(searchState)
}

export const useSearchResults = () => {
  const { searchState } = useSearch()
  return useSearchInfiniteQuery(searchState)
}
