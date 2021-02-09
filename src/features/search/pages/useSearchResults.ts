import { SearchResponse } from '@algolia/client-search'
import { QueryFunctionContext, useInfiniteQuery } from 'react-query'

import { SearchAlgoliaHit } from 'libs/algolia'
import { fetchAlgolia } from 'libs/algolia/fetchAlgolia'

import { SearchParameters } from './reducer'
import { useSearch } from './SearchWrapper'

export const useSearchResults = () => {
  const { searchState } = useSearch()
  const { showResults: _showResults, ...searchParameters } = searchState

  return useInfiniteQuery<SearchResponse<SearchAlgoliaHit>>(
    ['searchResults', searchParameters],
    async (context: QueryFunctionContext<[string, SearchParameters], number>) =>
      await fetchAlgolia<SearchAlgoliaHit>({
        page: context.pageParam || 0,
        hitsPerPage: 20,
        ...context.queryKey[1],
        attributesToRetrieve: [
          'offer.category',
          'offer.dates',
          'offer.id',
          'offer.description',
          'offer.thumbUrl',
          'offer.isDuo',
          'offer.name',
          'offer.prices',
          'objectID',
          '_geoloc',
        ],
      }),
    {
      getNextPageParam: ({ page, nbPages }) => (page < nbPages ? page + 1 : undefined),
    }
  )
}
