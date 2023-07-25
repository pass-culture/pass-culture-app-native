import { useSearchInfiniteQuery } from 'features/search/api/useSearchResults/useSearchResults'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchState, SearchView } from 'features/search/types'
import {
  mockedAlgoliaVenueResponse,
  mockedAlgoliaResponse,
} from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import * as fetchAlgoliaOffer from 'libs/algolia/fetchAlgolia/fetchOffers'
import * as fetchAlgoliaOffersAndVenues from 'libs/algolia/fetchAlgolia/fetchOffersAndVenues/fetchOffersAndVenues'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { flushAllPromisesWithAct, renderHook } from 'tests/utils'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')

describe('useSearchResults', () => {
  describe('useSearchInfiniteQuery', () => {
    const fetchOfferSpy = jest
      .spyOn(fetchAlgoliaOffer, 'fetchOffers')
      .mockResolvedValue(mockedAlgoliaResponse)

    const fetchAlgoliaOffersAndVenuesSpy = jest
      .spyOn(fetchAlgoliaOffersAndVenues, 'fetchOffersAndVenues')
      .mockResolvedValue({
        offersResponse: mockedAlgoliaResponse,
        venuesResponse: mockedAlgoliaVenueResponse,
      })

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

    describe('When wipEnableVenuesInSearchResults feature flag activated', () => {
      beforeEach(() => {
        useFeatureFlagSpy.mockReturnValue(true)
      })

      it('should fetch offers and venues', async () => {
        renderHook(useSearchInfiniteQuery, {
          // eslint-disable-next-line local-rules/no-react-query-provider-hoc
          wrapper: ({ children }) => reactQueryProviderHOC(children),
          initialProps: initialSearchState,
        })

        await flushAllPromisesWithAct()

        expect(fetchAlgoliaOffersAndVenuesSpy).toHaveBeenCalledTimes(1)
      })

      it('should not fetch only offers', async () => {
        renderHook(useSearchInfiniteQuery, {
          // eslint-disable-next-line local-rules/no-react-query-provider-hoc
          wrapper: ({ children }) => reactQueryProviderHOC(children),
          initialProps: initialSearchState,
        })

        await flushAllPromisesWithAct()

        expect(fetchOfferSpy).not.toHaveBeenCalled()
      })
    })

    describe('When wipEnableVenuesInSearchResults feature flag deactivated', () => {
      beforeEach(() => {
        useFeatureFlagSpy.mockReturnValue(false)
      })
      it('should not fetch offers and venues ', async () => {
        renderHook(useSearchInfiniteQuery, {
          // eslint-disable-next-line local-rules/no-react-query-provider-hoc
          wrapper: ({ children }) => reactQueryProviderHOC(children),
          initialProps: initialSearchState,
        })

        await flushAllPromisesWithAct()

        expect(fetchAlgoliaOffersAndVenuesSpy).not.toHaveBeenCalled()
      })
      it('should only fetch offers ', async () => {
        renderHook(useSearchInfiniteQuery, {
          // eslint-disable-next-line local-rules/no-react-query-provider-hoc
          wrapper: ({ children }) => reactQueryProviderHOC(children),
          initialProps: initialSearchState,
        })

        await flushAllPromisesWithAct()

        expect(fetchOfferSpy).toHaveBeenCalledTimes(1)
      })
    })
  })
})
