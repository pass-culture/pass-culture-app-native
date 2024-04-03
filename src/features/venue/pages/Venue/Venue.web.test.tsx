import { SearchResponse } from '@algolia/client-search'
import mockdate from 'mockdate'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoriesResponseModelv2 } from 'api/gen'
import * as useGTLPlaylistsLibrary from 'features/gtlPlaylist/api/gtlPlaylistApi'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { Venue } from 'features/venue/pages/Venue/Venue'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { Offer } from 'shared/offer/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('features/venue/api/useVenue')
jest.mock('features/venue/api/useVenueOffers')
jest.mock('libs/itinerary/useItinerary')

const mockV4 = jest.fn()
jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(mockV4),
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

jest.spyOn(useGTLPlaylistsLibrary, 'fetchGTLPlaylists').mockResolvedValue([
  {
    title: 'Test',
    offers: {
      hits: [],
    } as unknown as SearchResponse<Offer>,
    layout: 'one-item-medium',
    entryId: '2xUlLBRfxdk6jeYyJszunX',
    minNumberOfOffers: 1,
  },
])

describe('<Venue />', () => {
  useRoute.mockImplementation(() => ({ params: { venueId } }))

  beforeEach(() => {
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', placeholderData)
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<Venue />))

      await screen.findAllByText('Le Petit Rintintin 1')

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should render correctly in web', async () => {
      const { container } = render(reactQueryProviderHOC(<Venue />), {
        theme: { isDesktopViewport: true },
      })
      await screen.findAllByText('Le Petit Rintintin 1')

      expect(container).toMatchSnapshot()
    })
  })
})
