import { SearchResponse } from '@algolia/client-search'
import flatten from 'lodash.flatten'
import { useMemo } from 'react'
import { QueryFunctionContext, useInfiniteQuery } from 'react-query'

import { SearchParameters } from 'features/search/types'
import { QueryKeys } from 'libs/queryKeys'
import { SearchHit } from 'libs/search'
import { useAlgoliaQuery } from 'libs/search/fetch/useAlgoliaQuery'
import { useAppSearchBackend } from 'libs/search/fetch/useAppSearchBackend'
import { useSearchQuery } from 'libs/search/fetch/useSearchQuery'

import { useSearch, useStagedSearch } from './SearchWrapper'

type PartialSearchState = SearchParameters & { query: string }
export type Response = Pick<SearchResponse<SearchHit>, 'hits' | 'nbHits' | 'page' | 'nbPages'>

const useSearchInfiniteQuery = (searchState: PartialSearchState) => {
  const { enabled, isAppSearchBackend } = useAppSearchBackend()
  const algoliaBackend = useAlgoliaQuery()
  const searchBackend = useSearchQuery()

  const backend = isAppSearchBackend ? searchBackend : algoliaBackend
  const { fetchHits, transformHits } = backend

  const { data, ...infiniteQuery } = useInfiniteQuery<Response>(
    [QueryKeys.SEARCH_RESULTS, searchState],
    async (context: QueryFunctionContext<[string, PartialSearchState], number>) => {
      const page = context.pageParam || 0
      const searchState = context.queryKey[1]

      return await fetchHits({ page, ...searchState })
    },
    {
      getNextPageParam: ({ page, nbPages }) => (page < nbPages ? page + 1 : undefined),
      enabled,
      onSettled: () => {
        if (!isAppSearchBackend) {
          // Whilst app search is not activated, we still launch the request to populate
          // App search's cache for future faster requests. Thus we build up the cache
          // with actual requests.
          // TODO(antoinewg): delete once the migration to AppSearch is completed
          searchBackend.fetchHits({ page: 0, ...searchState })
        }
      },
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
  const { showResults: _showResults, ...searchParameters } = searchState
  return useSearchInfiniteQuery(searchParameters)
}

export const useSearchResults = () => {
  const { searchState } = useSearch()
  const { showResults: _showResults, ...searchParameters } = searchState
  return useSearchInfiniteQuery(searchParameters)
}
