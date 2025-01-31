import mockdate from 'mockdate'
import React, { createRef } from 'react'
import { ScrollView } from 'react-native'

import { push } from '__mocks__/@react-navigation/native'
import { OfferCTAProvider } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { VenueContent } from 'features/venue/components/VenueContent/VenueContent'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { LocationMode } from 'libs/location/types'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent, waitFor } from 'tests/utils'
import { AnchorProvider } from 'ui/components/anchor/AnchorContext'
import * as useModalAPI from 'ui/components/modals/useModal'

const mockFFValue = false
jest.mock('libs/firebase/firestore/featureFlags/useFeatureFlag', () => ({
  useFeatureFlag: () => mockFFValue,
}))

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

const renderVenueContent = (props?: Partial<React.ComponentProps<typeof VenueContent>>) => {
  return render(
    reactQueryProviderHOC(
      <AnchorProvider scrollViewRef={createRef<ScrollView>()} handleCheckScrollY={() => 0}>
        <OfferCTAProvider>
          <VenueContent venue={venueDataTest} {...props}>
            <React.Fragment></React.Fragment>
          </VenueContent>
        </OfferCTAProvider>
      </AnchorProvider>
    )
  )
}

const user = userEvent.setup()

describe('<VenueContent />', () => {
  it('should search the offers associated when pressing "Rechercher une offre"', async () => {
    renderVenueContent({ isCTADisplayed: true })

    await user.press(screen.getByText('Rechercher une offre'))

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
    renderVenueContent()
    await screen.findAllByText('Le Petit Rintintin 1')

    expect(screen.queryByText('Rechercher une offre')).not.toBeOnTheScreen()
  })

  describe('Batch trigger', () => {
    it('should trigger event after 5 seconds', async () => {
      renderVenueContent()

      await act(async () => {
        jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS)
      })

      expect(BatchProfile.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenVenueForSurvey)
    })

    it('should not trigger event before 5 seconds have elapsed', async () => {
      renderVenueContent()

      await act(async () => {
        jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS - 100)
      })

      expect(BatchProfile.trackEvent).not.toHaveBeenCalled()
    })
  })
})
