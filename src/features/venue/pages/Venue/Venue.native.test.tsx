import { SearchResponse } from '@algolia/client-search'
import mockdate from 'mockdate'
import React from 'react'
import { UseQueryResult } from 'react-query'

import { push, useRoute } from '__mocks__/@react-navigation/native'
import { SubcategoryIdEnum } from 'api/gen'
import * as useGTLPlaylistsLibrary from 'features/gtlPlaylist/api/gtlPlaylistApi'
import { Referrals } from 'features/navigation/RootNavigator/types'
import { LocationType } from 'features/search/enums'
import { SearchView } from 'features/search/types'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import { Venue } from 'features/venue/pages/Venue/Venue'
import { analytics } from 'libs/analytics'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { Offer } from 'shared/offer/types'
import {
  act,
  bottomScrollEvent,
  fireEvent,
  middleScrollEvent,
  render,
  screen,
  waitFor,
} from 'tests/utils'

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('react-query')
jest.mock('features/venue/api/useVenue')
jest.mock('features/venue/api/useVenueOffers')
const mockUseVenueOffers = jest.mocked(useVenueOffers)

jest.mock('libs/firebase/firestore/featureFlags/useFeatureFlag')
const mockUseFeatureFlag = useFeatureFlag as jest.MockedFunction<typeof useFeatureFlag>

const mockSubcategories = placeholderData.subcategories
const mockHomepageLabels = placeholderData.homepageLabels
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

jest.mock('features/home/helpers/useHomePosition', () => ({
  useHomePosition: jest.fn().mockReturnValue({
    position: {
      latitude: 2,
      longitude: 2,
    },
  }),
}))

jest.mock('features/profile/helpers/useIsUserUnderage', () => ({
  useIsUserUnderage: jest.fn().mockReturnValue(false),
}))

const gtlPLaylistSpy = jest.spyOn(useGTLPlaylistsLibrary, 'fetchGTLPlaylists').mockResolvedValue([
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
  },
])

jest.useFakeTimers({ legacyFakeTimers: true })

describe('<Venue />', () => {
  beforeAll(() => {
    mockUseFeatureFlag.mockReturnValue(false)
  })

  it('should match snapshot', async () => {
    renderVenue(venueId)
    await act(async () => {})

    expect(screen).toMatchSnapshot()
  })

  it('should log consult venue when URL has from param with deeplink', async () => {
    renderVenue(venueId, 'deeplink')
    await act(async () => {})

    expect(analytics.logConsultVenue).toHaveBeenNthCalledWith(1, {
      venueId,
      from: 'deeplink',
    })
  })

  it('should not log consult venue when URL has "from" param with something other than deeplink', async () => {
    renderVenue(venueId, 'search')
    await act(async () => {})

    expect(analytics.logConsultVenue).not.toHaveBeenCalled()
  })

  it('should not log consult venue when URL has not "from" param', async () => {
    renderVenue(venueId)
    await act(async () => {})

    expect(analytics.logConsultVenue).not.toHaveBeenCalled()
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
        jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS - 1)
      })

      expect(BatchUser.trackEvent).not.toHaveBeenCalled()
    })

    it('should trigger event on scroll to bottom', async () => {
      renderVenue(venueId)

      await act(async () => {
        fireEvent.scroll(screen.getByTestId('venue-container'), bottomScrollEvent)
      })

      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenVenueForSurvey)
    })

    it('should not trigger event on scroll to middle', async () => {
      renderVenue(venueId)

      await act(async () => {
        fireEvent.scroll(screen.getByTestId('venue-container'), middleScrollEvent)
      })

      expect(BatchUser.trackEvent).not.toHaveBeenCalled()
    })

    it('should trigger event once on scroll to bottom and after 5 seconds', async () => {
      renderVenue(venueId)

      fireEvent.scroll(screen.getByTestId('venue-container'), bottomScrollEvent)
      await act(async () => {
        jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)
      })

      expect(BatchUser.trackEvent).toHaveBeenCalledTimes(1)
      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenVenueForSurvey)
    })
  })
})

describe('<Venue /> with new venue body', () => {
  const defaultParams = {
    beginningDatetime: undefined,
    date: null,
    endingDatetime: undefined,
    hitsPerPage: 30,
    offerCategories: [],
    offerSubcategories: [],
    offerIsDuo: false,
    offerIsFree: false,
    offerIsNew: false,
    offerTypes: { isDigital: false, isEvent: false, isThing: false },
    priceRange: [0, 300],
    query: '',
    view: SearchView.Landing,
    tags: [],
    timeRange: null,
    locationFilter: { locationType: LocationType.EVERYWHERE },
  }

  beforeAll(() => {
    mockUseFeatureFlag.mockReturnValue(true)
  })

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
        params: {
          ...defaultParams,
          view: SearchView.Results,
          venue: {
            label: 'Le Petit Rintintin 1',
            info: 'Paris',
            geolocation: { latitude: 48.87004, longitude: 2.3785 },
            venueId: 5543,
          },
          previousView: SearchView.Results,
        },
        screen: 'Search',
      })
    })
  })

  it('should not display "Rechercher une offre" button if there is no offer', async () => {
    mockUseVenueOffers.mockReturnValueOnce({
      data: { hits: [], nbHits: 0 },
    } as unknown as UseQueryResult<{ hits: Offer[]; nbHits: number }, unknown>)
    mockUseVenueOffers.mockReturnValueOnce({
      data: { hits: [], nbHits: 0 },
    } as unknown as UseQueryResult<{ hits: Offer[]; nbHits: number }, unknown>)
    gtlPLaylistSpy.mockResolvedValueOnce([])
    gtlPLaylistSpy.mockResolvedValueOnce([])

    renderVenue(venueId)

    await act(async () => {})

    expect(screen.queryByText('Rechercher une offre')).not.toBeOnTheScreen()
  })
})

async function renderVenue(id: number, from?: Referrals) {
  useRoute.mockImplementation(() => ({ params: { id, from } }))
  render(<Venue />)
}
