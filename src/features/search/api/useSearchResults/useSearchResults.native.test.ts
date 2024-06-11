import algoliasearch from 'algoliasearch'

import { useSearchInfiniteQuery } from 'features/search/api/useSearchResults/useSearchResults'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchState } from 'features/search/types'
import * as fetchSearchResults from 'libs/algolia/fetchAlgolia/fetchSearchResults/fetchSearchResults'
import { algoliaFacets } from 'libs/algolia/fixtures/algoliaFacets'
import {
  mockedAlgoliaResponse,
  mockedAlgoliaVenueResponse,
} from 'libs/algolia/fixtures/algoliaFixtures'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('algoliasearch')

const mockMultipleQueries = algoliasearch('', '').multipleQueries

jest.mock('libs/firebase/analytics/analytics')

describe('useSearchResults', () => {
  describe('useSearchInfiniteQuery', () => {
    it('should fetch offers, venues and all facets', async () => {
      renderHook(useSearchInfiniteQuery, {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
        initialProps: initialSearchState,
      })

      await waitFor(() => {
        expect(mockMultipleQueries).toHaveBeenNthCalledWith(1, [
          {
            indexName: 'algoliaOffersIndexName',
            params: {
              attributesToHighlight: [],
              attributesToRetrieve: [
                'offer.dates',
                'offer.isDigital',
                'offer.isDuo',
                'offer.isEducational',
                'offer.name',
                'offer.prices',
                'offer.subcategoryId',
                'offer.thumbUrl',
                'objectID',
                '_geoloc',
                'venue',
              ],
              clickAnalytics: true,
              facetFilters: [['offer.isEducational:false']],
              hitsPerPage: 20,
              numericFilters: [['offer.prices: 0 TO 300']],
              page: 0,
            },
            query: '',
          },
          {
            indexName: 'algoliaVenuesIndexPlaylistSearchNewest',
            params: { aroundRadius: 'all', clickAnalytics: true, hitsPerPage: 35, page: 0 },
            query: '',
          },
          {
            facets: [
              'offer.bookMacroSection',
              'offer.movieGenres',
              'offer.musicType',
              'offer.nativeCategoryId',
              'offer.showType',
            ],
            indexName: 'algoliaOffersIndexName',
            params: {
              facetFilters: [['offer.isEducational:false']],
              hitsPerPage: 20,
              numericFilters: [['offer.prices: 0 TO 300']],
              page: 0,
            },
            query: '',
          },
        ])
      })
    })

    it('should not fetch again when focus on suggestion changes', async () => {
      const { rerender } = renderHook(
        (searchState: SearchState = initialSearchState) => useSearchInfiniteQuery(searchState),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      rerender({ ...initialSearchState })
      await waitFor(() => {
        expect(mockMultipleQueries).toHaveBeenCalledTimes(1)
      })
    })

    // because of an Algolia issue, sometimes nbHits is at 0 even when there is some hits, cf PC-28287
    it('should show hit numbers even if nbHits is at 0 but hits are not null', async () => {
      jest.spyOn(fetchSearchResults, 'fetchSearchResults').mockResolvedValueOnce({
        offersResponse: { ...mockedAlgoliaResponse, nbHits: 0 },
        venuesResponse: mockedAlgoliaVenueResponse,
        facetsResponse: algoliaFacets,
      })

      const { result } = renderHook(
        (searchState: SearchState = initialSearchState) => useSearchInfiniteQuery(searchState),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await waitFor(() => {
        const hitNumber = result.current.nbHits

        expect(hitNumber).toEqual(4)
      })
    })
  })
})
