import {
  getNextPageParam,
  useSearchInfiniteQuery,
} from 'features/search/api/useSearchResults/useSearchResults'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchState, SearchView } from 'features/search/types'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import * as fetchAlgoliaOffer from 'libs/algolia/fetchAlgolia/fetchOffer'
import { analytics } from 'libs/firebase/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { flushAllPromisesWithAct, renderHook } from 'tests/utils'

describe('useSearchResults', () => {
  describe('getNextPageParam', () => {
    it('should return page + 1 when page + 1 < nbPages', () => {
      const page = getNextPageParam({ page: 0, nbPages: 2 })
      expect(page).toStrictEqual(1)
    })

    it('should return undefined when page + 1 >= nbPages', () => {
      const page = getNextPageParam({ page: 1, nbPages: 2 })
      expect(page).toStrictEqual(undefined)
    })
  })

  describe('useSearchInfiniteQuery', () => {
    const fetchOfferSpy = jest
      .spyOn(fetchAlgoliaOffer, 'fetchOffer')
      .mockResolvedValue(mockedAlgoliaResponse)

    it('should log perform search when received API result', async () => {
      renderHook(useSearchInfiniteQuery, {
        // eslint-disable-next-line local-rules/no-react-query-provider-hoc
        wrapper: ({ children }) => reactQueryProviderHOC(children),
        initialProps: initialSearchState,
      })

      await flushAllPromisesWithAct()

      expect(fetchOfferSpy).toHaveBeenCalledTimes(1)
      expect(analytics.logPerformSearch).toHaveBeenNthCalledWith(
        1,
        initialSearchState,
        mockedAlgoliaResponse.nbHits
      )
    })

    it('should not fetch again when only view changes', async () => {
      const { rerender } = renderHook(
        (searchState: SearchState = initialSearchState) => useSearchInfiniteQuery(searchState),
        {
          // eslint-disable-next-line local-rules/no-react-query-provider-hoc
          wrapper: ({ children }) => reactQueryProviderHOC(children),
        }
      )

      await flushAllPromisesWithAct()
      rerender({ ...initialSearchState, view: SearchView.Suggestions })

      expect(fetchOfferSpy).toHaveBeenCalledTimes(1)
    })
  })
})
