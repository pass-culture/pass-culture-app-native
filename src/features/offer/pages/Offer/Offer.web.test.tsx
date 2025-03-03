import React from 'react'

import { OfferResponseV2, SimilarOffersResponse } from 'api/gen'
import { VenueListItem } from 'features/offer/components/VenueSelectionList/VenueSelectionList'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { Offer } from 'features/offer/pages/Offer/Offer'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, screen, act } from 'tests/utils/web'

jest.setTimeout(20000) // to avoid exceeded timeout

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

const mockedOffer: Partial<OfferResponseV2> | undefined = offerResponseSnap
jest.mock('features/offer/api/useOffer', () => ({
  useOffer: () => ({
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
jest.mock('api/useSearchVenuesOffer/useSearchVenueOffers', () => ({
  useSearchVenueOffers: () => ({
    hasNextPage: mockHasNextPage,
    fetchNextPage: mockFetchNextPage,
    data: mockData,
    venueList: mockVenueList,
    nbVenueItems: mockNbVenueItems,
    isFetching: false,
  }),
}))

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

// TODO(PC-34650) : react-native-web bump needed because of "setNativeProps is deprecated" warning making the test to fail
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('<Offer/>', () => {
  describe('Accessibility', () => {
    beforeEach(() => {
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
