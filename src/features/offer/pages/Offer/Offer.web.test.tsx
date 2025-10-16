import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { OfferResponseV2, SimilarOffersResponse } from 'api/gen'
import { ConsentState } from 'features/cookies/enums'
import * as Cookies from 'features/cookies/helpers/useCookies'
import { ConsentStatus } from 'features/cookies/types'
import { VenueListItem } from 'features/offer/components/VenueSelectionList/VenueSelectionList'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { Offer } from 'features/offer/pages/Offer/Offer'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render, screen } from 'tests/utils/web'

jest.setTimeout(20_000) // to avoid exceeded timeout

const mockedOffer: Partial<OfferResponseV2> | undefined = offerResponseSnap
jest.mock('queries/offer/useOfferQuery', () => ({
  useOfferQuery: () => ({
    data: mockedOffer,
    isLoading: false,
  }),
}))

// Fix the error "IDs used in ARIA and labels must be unique (duplicate-id-aria)" because the UUIDV4 mock return "testUuidV4"
jest.mock('uuid', () => {
  let value = 0
  return {
    v1: jest.fn(),
    v4: jest.fn(() => value++),
  }
})

jest.mock('libs/subcategories/useSubcategories')

const mockHasNextPage = true
const mockFetchNextPage = jest.fn()
const mockData = {
  pages: [
    {
      nbHits: 0,
      hits: [],
      page: 0,
    },
  ],
}
const mockVenueList: VenueListItem[] = []
const mockNbVenueItems = 0
jest.mock('queries/searchVenuesOffer/useSearchVenueOffersInfiniteQuery', () => ({
  useSearchVenueOffersInfiniteQuery: () => ({
    hasNextPage: mockHasNextPage,
    fetchNextPage: mockFetchNextPage,
    data: mockData,
    venueList: mockVenueList,
    nbVenueItems: mockNbVenueItems,
    isFetching: false,
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

const consentState: ConsentStatus = { state: ConsentState.LOADING }

const defaultUseCookies = {
  cookiesConsent: consentState,
  setCookiesConsent: jest.fn(),
  setUserId: jest.fn(),
  loadCookiesConsent: jest.fn(),
}
jest.spyOn(Cookies, 'useCookies').mockReturnValue(defaultUseCookies)

describe('<Offer/>', () => {
  describe('Accessibility', () => {
    beforeEach(() => {
      useRoute.mockReturnValue({ params: { id: mockedOffer.id } })
      setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
      mockServer.getApi<SimilarOffersResponse>(`/v1/recommendation/similar_offers/116656`, {
        params: {},
        results: [],
      })
      mockServer.getApi<SimilarOffersResponse>(`/v1/recommendation/similar_offers/116656`, {
        params: {},
        results: [],
      })
    })

    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<Offer />))
      await screen.findByTestId('sticky-booking-button')

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
