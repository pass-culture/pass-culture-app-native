import { SearchResponse } from '@algolia/client-search'
import { QueryFunctionContext, useInfiniteQuery } from 'react-query'

import { AlgoliaHit } from 'libs/algolia'
import { fetchAlgolia } from 'libs/algolia/fetchAlgolia'

import { SearchParameters } from './reducer'
import { useSearch, useStagedSearch } from './SearchWrapper'

const useSearchInfiniteQuery = (searchParameters: SearchParameters) =>
  useInfiniteQuery<SearchResponse<AlgoliaHit>>(
    ['searchResults', searchParameters],
    async (context: QueryFunctionContext<[string, SearchParameters], number>) =>
      await fetchAlgolia({
        page: context.pageParam || 0,
        hitsPerPage: 20,
        ...context.queryKey[1],
      }),
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
