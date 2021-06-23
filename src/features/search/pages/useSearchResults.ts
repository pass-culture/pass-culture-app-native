import { SearchResponse } from '@algolia/client-search'
import flatten from 'lodash.flatten'
import { useMemo } from 'react'
import { QueryFunctionContext, useInfiniteQuery } from 'react-query'

import { SearchParameters } from 'features/search/types'
import { QueryKeys } from 'libs/queryKeys'
import { SearchHit, useFetchQuery } from 'libs/search'

import { useSearch, useStagedSearch } from './SearchWrapper'

type PartialSearchState = SearchParameters & { query: string }

const useSearchInfiniteQuery = (searchState: PartialSearchState) => {
  const { enabled, fetchHits, transformHits } = useFetchQuery()
  const { data, ...infiniteQuery } = useInfiniteQuery<SearchResponse<SearchHit>>(
    [QueryKeys.SEARCH_RESULTS, searchState],
    async (context: QueryFunctionContext<[string, PartialSearchState], number>) => {
      const page = context.pageParam || 0
      const searchState = context.queryKey[1]

      return await fetchHits({ page, ...searchState })
    },
    {
      getNextPageParam: ({ page, nbPages }) => (page < nbPages ? page + 1 : undefined),
      enabled,
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
