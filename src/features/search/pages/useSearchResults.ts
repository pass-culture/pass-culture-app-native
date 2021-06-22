import { SearchResponse } from '@algolia/client-search'
import { QueryFunctionContext, useInfiniteQuery } from 'react-query'

import { SearchParameters } from 'features/search/types'
import { SearchHit, fetchAlgolia } from 'libs/search'

import { useSearch, useStagedSearch } from './SearchWrapper'

type PartialSearchState = SearchParameters & { query: string }

const useSearchInfiniteQuery = (searchState: PartialSearchState) =>
  useInfiniteQuery<SearchResponse<SearchHit>>(
    ['searchResults', searchState],
    async (context: QueryFunctionContext<[string, PartialSearchState], number>) => {
      const page = context.pageParam || 0
      const searchState = context.queryKey[1]

      return await fetchAlgolia({ page, ...searchState })
    },
    {
      getNextPageParam: ({ page, nbPages }) => (page < nbPages ? page + 1 : undefined),
    }
  )

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
