import { useSearchInfiniteQuery } from 'features/search/api/useSearchResults/useSearchResults'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchState, SearchView } from 'features/search/types'
import {
  mockedAlgoliaVenueResponse,
  mockedAlgoliaResponse,
} from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { mockedFacets } from 'libs/algolia/__mocks__/mockedFacets'
import * as fetchSearchResults from 'libs/algolia/fetchAlgolia/fetchSearchResults/fetchSearchResults'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { flushAllPromisesWithAct, renderHook } from 'tests/utils'

describe('useSearchResults', () => {
  describe('useSearchInfiniteQuery', () => {
    const fetchAlgoliaOffersAndVenuesSpy = jest
      .spyOn(fetchSearchResults, 'fetchSearchResults')
      .mockResolvedValue({
        offersResponse: mockedAlgoliaResponse,
        venuesResponse: mockedAlgoliaVenueResponse,
        facetsResponse: mockedFacets,
      })

    it('should fetch offers, venues and all facets', async () => {
      renderHook(useSearchInfiniteQuery, {
        wrapper: ({ children }) => reactQueryProviderHOC(children),
        initialProps: initialSearchState,
      })

      await flushAllPromisesWithAct()

      expect(fetchAlgoliaOffersAndVenuesSpy).toHaveBeenCalledTimes(1)
    })

    it('should not fetch again when focus on suggestion changes', async () => {
      const { rerender } = renderHook(
        (searchState: SearchState = initialSearchState) => useSearchInfiniteQuery(searchState),
        {
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await flushAllPromisesWithAct()
      rerender({ ...initialSearchState, view: SearchView.Results })

      expect(fetchAlgoliaOffersAndVenuesSpy).toHaveBeenCalledTimes(1)
    })
  })
})
