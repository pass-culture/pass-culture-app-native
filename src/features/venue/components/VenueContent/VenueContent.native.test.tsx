import mockdate from 'mockdate'
import React, { createRef } from 'react'
import { ScrollView } from 'react-native'

import { push } from '__mocks__/@react-navigation/native'
import { VenueTypeCodeKey } from 'api/gen'
import { OfferCTAProvider } from 'features/offer/components/OfferContent/OfferCTAProvider'
import { VenueContent } from 'features/venue/components/VenueContent/VenueContent'
import { cinemaCTAButtonName } from 'features/venue/components/VenueOffers/VenueOffers'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import {
  VenueMoviesOffersResponseSnap,
  VenueOffersResponseSnap,
} from 'features/venue/fixtures/venueOffersResponseSnap'
import { LocationMode } from 'libs/location/types'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, fireEvent, render, screen, userEvent, waitFor } from 'tests/utils'
import { AnchorProvider } from 'ui/components/anchor/AnchorContext'
import * as AnchorContextModule from 'ui/components/anchor/AnchorContext'
import * as useModalAPI from 'ui/components/modals/useModal'

const useScrollToAnchorSpy = jest.spyOn(AnchorContextModule, 'useScrollToAnchor')

let mockFFValue = false
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

const mockInView = jest.fn()
const InViewMock = ({
  onChange,
  children,
}: {
  onChange: VoidFunction
  children: React.ReactNode
}) => {
  mockInView.mockImplementation(onChange)
  return <React.Fragment>{children}</React.Fragment>
}

jest.mock('react-native-intersection-observer', () => {
  return {
    ...jest.requireActual('react-native-intersection-observer'),
    InView: InViewMock,
    mockInView,
  }
})

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
          <VenueContent venue={venueDataTest} {...props} />
        </OfferCTAProvider>
      </AnchorProvider>
    )
  )
}

describe('<VenueContent />', () => {
  it('should search the offers associated when pressing "Rechercher une offre"', async () => {
    renderVenueContent({
      venueOffers: { hits: VenueOffersResponseSnap, nbHits: 4 },
    })

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

      expect(BatchUser.trackEvent).toHaveBeenCalledWith(BatchEvent.hasSeenVenueForSurvey)
    })

    it('should not trigger event before 5 seconds have elapsed', async () => {
      renderVenueContent()

      await act(async () => {
        jest.advanceTimersByTime(BATCH_TRIGGER_DELAY_IN_MS - 100)
      })

      expect(BatchUser.trackEvent).not.toHaveBeenCalled()
    })
  })

  it('should display default background image when no banner for venue', async () => {
    renderVenueContent()

    expect(await screen.findByTestId('defaultVenueBackground')).toBeOnTheScreen()
  })

  it('should display fake video player', async () => {
    renderVenueContent({ videoSectionVisible: true })

    expect(await screen.findByLabelText('Faux lecteur vidéo')).toBeOnTheScreen()
  })

  it('should open survey modal when fake video player is pressed', async () => {
    renderVenueContent({ videoSectionVisible: true })

    fireEvent.press(await screen.findByLabelText('Faux lecteur vidéo'))

    expect(mockShowModal).toHaveBeenCalledWith()
  })

  describe('movie screening access button', () => {
    const venueMoviesOffersMock = { hits: VenueMoviesOffersResponseSnap, nbHits: 4 }
    mockFFValue = true

    it('should show button', async () => {
      renderVenueContent({
        venue: { ...venueDataTest, venueTypeCode: VenueTypeCodeKey.MOVIE },
        venueOffers: venueMoviesOffersMock,
      })
      await act(async () => {
        mockInView(false)
      })

      await screen.findByText('Les films à l’affiche')

      expect(await screen.findByText(cinemaCTAButtonName)).toBeOnTheScreen()
    })

    it('should not show button', async () => {
      renderVenueContent({
        venue: { ...venueDataTest, venueTypeCode: VenueTypeCodeKey.MOVIE },
        venueOffers: venueMoviesOffersMock,
      })
      await act(async () => {
        mockInView(true)
      })

      await screen.findByText('Les films à l’affiche')

      expect(screen.queryByText(cinemaCTAButtonName)).not.toBeOnTheScreen()
    })

    it('should scroll to anchor', async () => {
      renderVenueContent({
        venue: { ...venueDataTest, venueTypeCode: VenueTypeCodeKey.MOVIE },
        venueOffers: venueMoviesOffersMock,
      })

      await act(async () => {
        mockInView(false)
      })

      const button = await screen.findByText(cinemaCTAButtonName)

      await userEvent.press(button)

      expect(useScrollToAnchorSpy).toHaveBeenCalledWith()
    })
  })
})
