import { SearchResponse } from '@algolia/client-search'
import mockdate from 'mockdate'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import * as useGTLPlaylistsLibrary from 'features/gtlPlaylist/api/gtlPlaylistApi'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { Venue } from 'features/venue/pages/Venue/Venue'
import { Offer } from 'shared/offer/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, act } from 'tests/utils/web'

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('features/venue/api/useVenue')
jest.mock('features/venue/api/useVenueOffers')

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

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<Venue />))

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })

    // TODO(PC-26577): fix test flackyness
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('should render correctly in web', async () => {
      render(<Venue />, { theme: { isDesktopViewport: true } })
      await act(async () => {})

      expect(screen).toMatchSnapshot()
    })
  })
})
