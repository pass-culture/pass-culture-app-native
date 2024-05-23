import { SearchResponse } from '@algolia/client-search'
import mockdate from 'mockdate'
import React from 'react'
import { UseQueryResult } from 'react-query'

import { push, useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoryIdEnum } from 'api/gen'
import { useGTLPlaylists } from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { Referrals } from 'features/navigation/RootNavigator/types'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { Venue } from 'features/venue/pages/Venue/Venue'
import { analytics } from 'libs/analytics'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { LocationMode, Position } from 'libs/location/types'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { Offer } from 'shared/offer/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

// TODO(PC-29000): Use fakeTimers modern instead
jest.useFakeTimers({ legacyFakeTimers: true })

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('features/venue/api/useVenue')
jest.mock('features/venue/api/useVenueOffers')
const mockUseVenueOffers = jest.mocked(useVenueOffers)

jest.mock('libs/itinerary/useItinerary')

const mockSubcategories = PLACEHOLDER_DATA.subcategories
const mockHomepageLabels = PLACEHOLDER_DATA.homepageLabels
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: {
      subcategories: mockSubcategories,
      homepageLabels: mockHomepageLabels,
    },
  }),
}))
const venueId = venueResponseSnap.id

const BATCH_TRIGGER_DELAY_IN_MS = 5000

const mockPosition: Position = undefined
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    userLocation: mockPosition,
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

const defaultParams = {
  beginningDatetime: undefined,
  date: null,
  endingDatetime: undefined,
  hitsPerPage: 30,
  offerCategories: [],
  offerSubcategories: [],
  offerIsDuo: false,
  offerIsFree: false,
  isDigital: false,
  priceRange: [0, 300],
  query: '',
  tags: [],
  timeRange: null,
  locationFilter: { locationType: LocationMode.EVERYWHERE },
}

describe('<Venue />', () => {
  it('should match snapshot', async () => {
    renderVenue(venueId)
    await act(async () => {})

    expect(screen).toMatchSnapshot()
  })

  it('should search the offers associated when pressing "Rechercher une offre"', async () => {
    renderVenue(venueId)

    fireEvent.press(screen.getByText('Rechercher une offre'))

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('TabNavigator', {
        screen: 'SearchStackNavigator',
        params: {
          screen: 'SearchResults',
          params: {
            ...defaultParams,
            venue: {
              label: 'Le Petit Rintintin 1',
              info: 'Paris',
              geolocation: { latitude: 48.87004, longitude: 2.3785 },
              venueId: 5543,
            },
          },
        },
      })
    })
  })

  it('should not display "Rechercher une offre" button if there is no offer', async () => {
    const emptyVenueOffers = {
      data: { hits: [], nbHits: 0 },
    } as unknown as UseQueryResult<{ hits: Offer[]; nbHits: number }, unknown>
    mockUseVenueOffers.mockReturnValueOnce(emptyVenueOffers)
    mockUseVenueOffers.mockReturnValueOnce(emptyVenueOffers)
    mockUseVenueOffers.mockReturnValueOnce(emptyVenueOffers)
    mockUseVenueOffers.mockReturnValueOnce(emptyVenueOffers)

    mockUseGTLPlaylists.mockResolvedValueOnce([])

    renderVenue(venueId)

    await act(async () => {})

    expect(screen.queryByText('Rechercher une offre')).not.toBeOnTheScreen()
  })

  describe('analytics', () => {
    it('should log consult venue when URL has from param with deeplink', async () => {
      renderVenue(venueId, 'deeplink')

      await waitFor(() => {
        expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
          venueId,
          from: 'deeplink',
        })
      })
    })

    it('should not log consult venue when URL has "from" param with something other than deeplink', async () => {
      renderVenue(venueId, 'searchresults')
      await act(async () => {})

      expect(analytics.logConsultVenue).not.toHaveBeenCalled()
    })

    it('should not log consult venue when URL has not "from" param', async () => {
      renderVenue(venueId)
      await act(async () => {})

      expect(analytics.logConsultVenue).not.toHaveBeenCalled()
    })
  })

  describe('Batch trigger', () => {
    it('should trigger event after 5 seconds', async () => {
      renderVenue(venueId)

      await act(async () => {
        jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)
      })

      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenVenueForSurvey)
    })

    it('should not trigger event before 5 seconds have elapsed', async () => {
      renderVenue(venueId)

      await act(async () => {
        jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS - 100)
      })

      expect(BatchUser.trackEvent).not.toHaveBeenCalled()
    })
  })
})

async function renderVenue(id: number, from?: Referrals) {
  useRoute.mockImplementation(() => ({ params: { id, from } }))
  render(reactQueryProviderHOC(<Venue />))
}
