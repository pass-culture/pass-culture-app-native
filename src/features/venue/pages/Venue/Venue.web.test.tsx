import { SearchResponse } from '@algolia/client-search'
import mockdate from 'mockdate'
import React from 'react'

import { SubcategoriesResponseModelv2 } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useGTLPlaylists } from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { initialSearchState } from 'features/search/context/reducer'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { Venue } from 'features/venue/pages/Venue/Venue'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { Offer } from 'shared/offer/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render, screen } from 'tests/utils/web'
import { useRoute } from '__mocks__/@react-navigation/native'

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('features/venue/api/useVenue')
jest.mock('features/venue/api/useVenueOffers')
jest.mock('libs/itinerary/useItinerary')

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>
mockUseAuthContext.mockReturnValue({
  isLoggedIn: false,
  setIsLoggedIn: jest.fn(),
  refetchUser: jest.fn(),
  isUserLoading: false,
})

jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(),
}))

const venueId = venueResponseSnap.id

jest.mock('libs/location', () => ({
  useLocation: jest.fn().mockReturnValue({
    userLocation: {
      latitude: 2,
      longitude: 2,
    },
  }),
}))

jest.mock('features/profile/helpers/useIsUserUnderage', () => ({
  useIsUserUnderage: jest.fn().mockReturnValue(false),
}))

jest.mock('features/gtlPlaylist/hooks/useGTLPlaylists')
const mockUseGTLPlaylists = useGTLPlaylists as jest.Mock
mockUseGTLPlaylists.mockReturnValue({
  gtlPlaylists: [
    {
      title: 'Test',
      offers: {
        hits: [],
      } as unknown as SearchResponse<Offer>,
      layout: 'one-item-medium',
      entryId: '2xUlLBRfxdk6jeYyJszunX',
      minNumberOfOffers: 1,
    },
  ],
  isLoading: false,
})

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))

jest.setTimeout(15_000)

describe('<Venue />', () => {
  useRoute.mockImplementation(() => ({ params: { venueId } }))

  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', PLACEHOLDER_DATA)
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<Venue />))

      await screen.findAllByText('Gratuit')

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
