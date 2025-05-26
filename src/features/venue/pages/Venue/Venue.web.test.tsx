import { SearchResponse } from '@algolia/client-search'
import mockdate from 'mockdate'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoriesResponseModelv2 } from 'api/gen'
import { useGTLPlaylistsQuery } from 'features/gtlPlaylist/queries/useGTLPlaylistsQuery'
import { initialSearchState } from 'features/search/context/reducer'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { Venue } from 'features/venue/pages/Venue/Venue'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { Offer } from 'shared/offer/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, fireEvent, render, screen } from 'tests/utils/web'

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('libs/subcategories/useSubcategory')
jest.mock('features/venue/queries/useVenueQuery')
jest.mock('queries/venue/useVenueOffersQuery')
jest.mock('libs/itinerary/useItinerary')

jest.mock('features/auth/context/AuthContext')

jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(),
}))

const venueId = venueDataTest.id

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

jest.mock('features/gtlPlaylist/queries/useGTLPlaylistsQuery')
const mockUseGTLPlaylists = useGTLPlaylistsQuery as jest.Mock
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

jest.setTimeout(30000) // to avoid exceeded timeout

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
jest.mock('features/navigation/TabBar/tabBarRoutes')
jest.mock('features/navigation/RootNavigator/linking/withAuthProtection')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('<Venue />', () => {
  useRoute.mockImplementation(() => ({ params: { venueId } }))

  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
  })

  it('should not have basic accessibility issues', async () => {
    const { container } = render(reactQueryProviderHOC(<Venue />))

    await screen.findAllByText('Gratuit')

    let results
    await act(async () => {
      results = await checkAccessibilityFor(container)
    })

    expect(results).toHaveNoViolations()
  })

  it('should show offers section', async () => {
    render(reactQueryProviderHOC(<Venue />))

    await screen.findAllByText('Gratuit')

    const sectionTitle = screen.getByText('Toutes les offres')

    expect(sectionTitle).toBeTruthy()
  })

  it('should show practical information when switching tabs', async () => {
    render(reactQueryProviderHOC(<Venue />))

    await screen.findAllByText('Gratuit')

    fireEvent.click(screen.getByText('Infos pratiques'))

    const sectionTitle = screen.getByText('Modalités de retrait')

    expect(sectionTitle).toBeTruthy()
  })
})
