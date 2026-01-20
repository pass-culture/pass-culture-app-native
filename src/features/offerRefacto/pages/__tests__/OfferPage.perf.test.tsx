import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import {
  BookingsResponse,
  GetRemindersResponse,
  OfferResponseV2,
  SimilarOffersResponse,
  SubcategoriesResponseModelv2,
} from 'api/gen'
import { ConsentState } from 'features/cookies/enums'
import * as Cookies from 'features/cookies/helpers/useCookies'
import { ConsentStatus } from 'features/cookies/types'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import * as GetInstalledAppsAPI from 'features/offer/helpers/getInstalledApps/getInstalledApps'
import { Offer } from 'features/offerRefacto/pages/Offer'
import {
  mockedAlgoliaOffersWithSameArtistResponse,
  mockedAlgoliaResponse,
} from 'libs/algolia/fixtures/algoliaFixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { Network } from 'libs/share/types'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import * as useArtistResultsAPI from 'queries/offer/useArtistResultsQuery'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, measurePerformance, screen } from 'tests/utils'

jest.mock('libs/jwt/jwt')
jest.mock('libs/firebase/analytics/analytics')
jest.mock('react-native/src/private/animated/NativeAnimatedHelper')

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}))

jest
  .spyOn(useArtistResultsAPI, 'useArtistResultsQuery')
  .mockImplementation()
  .mockReturnValue({
    artistPlaylist: mockedAlgoliaOffersWithSameArtistResponse,
    artistTopOffers: mockedAlgoliaOffersWithSameArtistResponse.slice(0, 4),
  })

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')
jest.useFakeTimers()

jest.mock('libs/network/NetInfoWrapper')

useRoute.mockReturnValue({
  params: {
    id: offerResponseSnap.id,
  },
})

// Mock to display one messaging app button
const mockGetInstalledApps = jest.spyOn(GetInstalledAppsAPI, 'getInstalledApps') as jest.Mock
mockGetInstalledApps.mockResolvedValue([Network.snapchat])

const consentState: ConsentStatus = { state: ConsentState.LOADING }

const defaultUseCookies = {
  cookiesConsent: consentState,
  setCookiesConsent: jest.fn(),
  setUserId: jest.fn(),
  loadCookiesConsent: jest.fn(),
}
jest.spyOn(Cookies, 'useCookies').mockReturnValue(defaultUseCookies)

// Performance measuring is run 10 times so we need to increase the timeout
const TEST_TIMEOUT_IN_MS = 20000
jest.setTimeout(TEST_TIMEOUT_IN_MS)

describe('<OfferPage />', () => {
  beforeEach(() => {
    setFeatureFlags()
    // We mock server instead of hooks to test the real behavior of the component.
    mockServer.getApi<OfferResponseV2>(`/v2/offer/${offerResponseSnap.id}`, {
      requestOptions: { persist: true },
      responseOptions: { data: offerResponseSnap },
    })
    mockServer.getApi(`/v1/recommendation/similar_offers/${offerResponseSnap.id}`, {
      requestOptions: { persist: true },
      responseOptions: { data: mockedAlgoliaResponse.hits },
    })
    mockServer.getApi<SimilarOffersResponse>(
      `/v1/recommendation/similar_offers/${offerResponseSnap.id}`,
      {
        params: {},
        results: [],
      }
    )
    mockServer.getApi<SubcategoriesResponseModelv2>(`/v1/subcategories/v2`, subcategoriesDataTest)
    mockServer.getApi<GetRemindersResponse>('/v1/me/reminders', {})
    mockServer.getApi<BookingsResponse>('/v1/bookings', {})
  })

  it('Performance test for Offer page', async () => {
    await measurePerformance(reactQueryProviderHOC(<Offer />), {
      scenario: async () => {
        await screen.findByTestId('offerv2-container', {}, { timeout: TEST_TIMEOUT_IN_MS })
        await act(async () => {})
      },
    })
  })
})
