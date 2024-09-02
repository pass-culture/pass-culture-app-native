import { SearchResponse } from '@algolia/client-search'
import mockdate from 'mockdate'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoriesResponseModelv2 } from 'api/gen'
import { useGTLPlaylists } from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { initialSearchState } from 'features/search/context/reducer'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { Venue } from 'features/venue/pages/Venue/Venue'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { Offer } from 'shared/offer/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, fireEvent, render, screen } from 'tests/utils/web'

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('libs/subcategories/useSubcategory')
jest.mock('features/venue/api/useVenue')
jest.mock('features/venue/api/useVenueOffers')
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

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/RemoteConfigProvider', () => ({
  useRemoteConfigContext: jest.fn().mockReturnValue({ shouldApplyGraphicRedesign: false }),
}))
jest.mock('features/navigation/RootNavigator/routes')
jest.mock('features/navigation/TabBar/routes')
jest.mock('features/navigation/RootNavigator/linking/withAuthProtection')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('<Venue />', () => {
  useRoute.mockImplementation(() => ({ params: { venueId } }))

  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
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

    it('should render correctly', async () => {
      const { container } = render(reactQueryProviderHOC(<Venue />))

      await screen.findAllByText('Gratuit')

      expect(container).toMatchSnapshot()
    })

    it('should render correctly with practical information', async () => {
      const { container } = render(reactQueryProviderHOC(<Venue />))

      await screen.findAllByText('Gratuit')

      fireEvent.click(screen.getByText('Infos pratiques'))

      expect(container).toMatchSnapshot()
    })
  })
})
