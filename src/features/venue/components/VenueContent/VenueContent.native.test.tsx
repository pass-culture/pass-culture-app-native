import mockdate from 'mockdate'
import React from 'react'

import { push } from '__mocks__/@react-navigation/native'
import { VenueContent } from 'features/venue/components/VenueContent/VenueContent'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { VenueOffersResponseSnap } from 'features/venue/fixtures/venueOffersResponseSnap'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { LocationMode } from 'libs/location/types'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'
import * as useModalAPI from 'ui/components/modals/useModal'

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

jest.useFakeTimers()

mockdate.set(new Date('2021-08-15T00:00:00Z'))

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')
jest.mock('features/gtlPlaylist/hooks/useGTLPlaylists', () => ({
  useGTLPlaylists: () => ({ isLoading: false }),
}))
jest.mock('features/venue/api/useVenueOffers', () => ({
  useVenueOffers: () => ({ isLoading: false }),
}))

jest.mock('libs/subcategories/useSubcategories')

jest.mock('libs/location')
jest.mock('features/search/context/SearchWrapper')
jest.mock('libs/firebase/analytics/analytics')

const defaultSearchParams = {
  beginningDatetime: undefined,
  date: null,
  endingDatetime: undefined,
  hitsPerPage: 50,
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

const mockShowModal = jest.fn()
jest.spyOn(useModalAPI, 'useModal').mockReturnValue({
  visible: false,
  showModal: mockShowModal,
  hideModal: jest.fn(),
  toggleModal: jest.fn(),
})

describe('<VenueContent />', () => {
  it('should search the offers associated when pressing "Rechercher une offre"', async () => {
    render(
      reactQueryProviderHOC(
        <VenueContent
          venue={venueDataTest}
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
    render(reactQueryProviderHOC(<VenueContent venue={venueDataTest} />))
    await screen.findAllByText('Le Petit Rintintin 1')

    expect(screen.queryByText('Rechercher une offre')).not.toBeOnTheScreen()
  })

  describe('Batch trigger', () => {
    it('should trigger event after 5 seconds', async () => {
      render(reactQueryProviderHOC(<VenueContent venue={venueDataTest} />))

      await act(async () => {
        jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)
      })

      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenVenueForSurvey)
    })

    it('should not trigger event before 5 seconds have elapsed', async () => {
      render(reactQueryProviderHOC(<VenueContent venue={venueDataTest} />))

      await act(async () => {
        jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS - 100)
      })

      expect(BatchUser.trackEvent).not.toHaveBeenCalled()
    })
  })

  it('should display default background image when no banner for venue', async () => {
    render(reactQueryProviderHOC(<VenueContent venue={venueDataTest} />))

    expect(await screen.findByTestId('defaultVenueBackground')).toBeOnTheScreen()
  })

  it('should display fake video player', async () => {
    render(reactQueryProviderHOC(<VenueContent venue={venueDataTest} videoSectionVisible />))

    expect(await screen.findByLabelText('Faux lecteur vidéo')).toBeOnTheScreen()
  })

  it('should open survey modal when fake video player is pressed', async () => {
    render(reactQueryProviderHOC(<VenueContent venue={venueDataTest} videoSectionVisible />))

    fireEvent.press(await screen.findByLabelText('Faux lecteur vidéo'))

    expect(mockShowModal).toHaveBeenCalledWith()
  })
})
