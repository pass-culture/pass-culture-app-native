import mockdate from 'mockdate'
import React from 'react'

import { push } from '__mocks__/@react-navigation/native'
import { VenueContent } from 'features/venue/components/VenueContent/VenueContent'
import { VenueOffersResponseSnap } from 'features/venue/fixtures/venueOffersResponseSnap'
import { venueResponseSnap } from 'features/venue/fixtures/venueResponseSnap'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { LocationMode } from 'libs/location/types'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

// TODO(PC-29000): Use fakeTimers modern instead
jest.useFakeTimers({ legacyFakeTimers: true })

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.mock('features/gtlPlaylist/hooks/useGTLPlaylists', () => ({
  useGTLPlaylists: () => ({ isLoading: false }),
}))
jest.mock('features/venue/api/useVenueOffers', () => ({
  useVenueOffers: () => ({ isLoading: false }),
}))

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

jest.mock('libs/location')
jest.mock('features/search/context/SearchWrapper')
jest.mock('libs/firebase/analytics/analytics')

const defaultSearchParams = {
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

const BATCH_TRIGGER_DELAY_IN_MS = 5000

describe('<VenueContent />', () => {
  it('should search the offers associated when pressing "Rechercher une offre"', async () => {
    render(
      reactQueryProviderHOC(
        <VenueContent
          venue={venueResponseSnap}
          venueOffers={{ hits: VenueOffersResponseSnap, nbHits: 4 }}
        />
      )
    )

    fireEvent.press(screen.getByText('Rechercher une offre'))

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('TabNavigator', {
        screen: 'SearchStackNavigator',
        params: {
          screen: 'SearchResults',
          params: {
            ...defaultSearchParams,
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
    render(reactQueryProviderHOC(<VenueContent venue={venueResponseSnap} />))
    await screen.findAllByText('Le Petit Rintintin 1')

    expect(screen.queryByText('Rechercher une offre')).not.toBeOnTheScreen()
  })

  describe('Batch trigger', () => {
    it('should trigger event after 5 seconds', async () => {
      render(reactQueryProviderHOC(<VenueContent venue={venueResponseSnap} />))

      await act(async () => {
        jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)
      })

      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenVenueForSurvey)
    })

    it('should not trigger event before 5 seconds have elapsed', async () => {
      render(reactQueryProviderHOC(<VenueContent venue={venueResponseSnap} />))

      await act(async () => {
        jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS - 100)
      })

      expect(BatchUser.trackEvent).not.toHaveBeenCalled()
    })
  })
})
