import {
  getNextPageParam,
  useSearchInfiniteQuery,
} from 'features/search/api/useSearchResults/useSearchResults'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchState, SearchView } from 'features/search/types'
import * as fetchAlgoliaOffer from 'libs/algolia/fetchAlgolia/fetchOffers/fetchOffers'
import { offersWithPageFixture } from 'libs/algolia/fetchAlgolia/fetchOffers/fixtures/offersWithPageFixture'
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
      .spyOn(fetchAlgoliaOffer, 'fetchOffers')
      .mockResolvedValue(offersWithPageFixture)

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
        offersWithPageFixture.nbOffers
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
