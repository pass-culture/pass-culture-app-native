import { SearchResponse } from '@algolia/client-search'
import mockdate from 'mockdate'
import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoryIdEnum, VenueResponse } from 'api/gen'
import { useGTLPlaylists } from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { Referrals } from 'features/navigation/RootNavigator/types'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { Venue } from 'features/venue/pages/Venue/Venue'
import { analytics } from 'libs/analytics'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { Offer } from 'shared/offer/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, waitFor, fireEvent } from 'tests/utils'

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

jest.useFakeTimers()

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/firebase/analytics/analytics')
jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

jest.mock('libs/itinerary/useItinerary')
jest.mock('features/venue/api/useVenueOffers')
jest.mock('features/search/context/SearchWrapper')
jest.mock('libs/location')

jest.mock('libs/subcategories/useSubcategories')
const venueId = venueDataTest.id

jest.mock('features/gtlPlaylist/hooks/useGTLPlaylists')
const mockUseGTLPlaylists = useGTLPlaylists as jest.Mock
mockUseGTLPlaylists.mockReturnValue({
  gtlPlaylists: [
    {
      title: 'Test',
      offers: {
        hits: [
          {
            offer: {
              name: 'Test',
              subcategoryId: SubcategoryIdEnum.ABO_BIBLIOTHEQUE,
            },
            venue: {
              address: 'Avenue des Tests',
              city: 'Jest',
            },
            _geoloc: {
              lat: 2,
              lng: 2,
            },
            objectID: '12',
          },
        ],
      } as SearchResponse<Offer>,
      layout: 'one-item-medium',
      entryId: '2xUlLBRfxdk6jeYyJszunX',
      minNumberOfOffers: 1,
    },
  ],
  isLoading: false,
})

describe('<Venue />', () => {
  beforeEach(() => {
    mockServer.getApi<VenueResponse>(`/v1/venue/${venueId}`, venueDataTest)
  })

  it('should match snapshot', async () => {
    renderVenue(venueId)

    await screen.findByText('Infos pratiques')

    expect(screen).toMatchSnapshot()
  })

  it('should match snapshot with practical information', async () => {
    renderVenue(venueId)

    fireEvent.press(await screen.findByText('Infos pratiques'))

    expect(screen).toMatchSnapshot()
  })

  describe('analytics', () => {
    it.each([['deeplink'], ['venueMap']])(
      'should log consult venue when URL from param equal to %s',
      async (from) => {
        renderVenue(venueId, from as Referrals)

        await waitFor(() => {
          expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
            venueId,
            from,
          })
        })
      }
    )

    it('should not log consult venue when URL has unexpected "from" param', async () => {
      renderVenue(venueId, 'unexpected_from_param' as Referrals)

      await screen.findByText('Infos pratiques')

      expect(analytics.logConsultVenue).not.toHaveBeenCalled()
    })

    it('should not log consult venue when URL has not "from" param', async () => {
      renderVenue(venueId)

      await screen.findByText('Infos pratiques')

      expect(analytics.logConsultVenue).not.toHaveBeenCalled()
    })
  })
})

async function renderVenue(id: number, from?: Referrals) {
  useRoute.mockImplementation(() => ({ params: { id, from } }))
  render(reactQueryProviderHOC(<Venue />))
}
