import React from 'react'

import { MovieCalendarProvider } from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { OfferCineContent } from 'features/offer/components/OfferCine/OfferCineContent'
import { offersStocksResponseSnap } from 'features/offer/fixtures/offersStocksResponse'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { LocationMode, Position } from 'libs/location/types'
import { mockBuilder } from 'tests/mockBuilder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen, userEvent } from 'tests/utils'

jest.mock('features/offer/helpers/useGetVenueByDay/useGetVenuesByDay')
jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/network/NetInfoWrapper')

const mockLocationMode = LocationMode.AROUND_ME
const mockUserLocation: Position = { latitude: 48.90374, longitude: 2.48171 }

jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    userLocation: mockUserLocation,
    selectedLocationMode: mockLocationMode,
  }),
}))

jest.mock('ui/components/anchor/AnchorContext', () => ({
  useScrollToAnchor: jest.fn,
  useRegisterAnchor: jest.fn,
}))

const defaultOffersStocksFromOfferQuery = {
  isInitialLoading: false,
  data: mockBuilder.offerResponseV2({}),
}
const mockuseOffersStocksFromOfferQuery = jest.fn(() => defaultOffersStocksFromOfferQuery)
jest.mock('features/offer/queries/useOffersStocksFromOfferQuery', () => ({
  useOffersStocksFromOfferQuery: () => mockuseOffersStocksFromOfferQuery(),
}))

const mockedMovieOffers = [
  ...offersStocksResponseSnap.offers.map((offer) => ({
    offer: { ...offer, id: offer.id },
    isUpcoming: false,
  })),
  ...offersStocksResponseSnap.offers.map((offer) => ({
    offer: { ...offer, id: offer.id + 111 },
    isUpcoming: false,
  })),
]

const mockedMovieOffersLongResult = [
  ...mockedMovieOffers,
  ...offersStocksResponseSnap.offers.map((offer) => ({
    offer: { ...offer, id: offer.id + 999 },
    isUpcoming: false,
  })),
]

const mockUseGetVenuesByDay = jest.fn(() => ({
  movieOffers: mockedMovieOffers,
  hasStocksOnlyAfter15Days: false,
}))

jest.mock('features/offer/helpers/useGetVenueByDay/useGetVenuesByDay', () => ({
  useGetVenuesByDay: () => mockUseGetVenuesByDay(),
  getDaysWithNoScreenings: jest.fn(),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
const mockOffer = mockBuilder.offerResponseV2({})

jest.useFakeTimers()

describe('OfferCineContent', () => {
  beforeAll(() => {
    setFeatureFlags()
  })

  it('should display skeleton when data is loading', async () => {
    mockuseOffersStocksFromOfferQuery
      .mockReturnValueOnce({
        ...defaultOffersStocksFromOfferQuery,
        isInitialLoading: true,
      })
      .mockReturnValueOnce({
        ...defaultOffersStocksFromOfferQuery,
        isInitialLoading: true,
      })
    renderOfferCineContent()

    expect(await screen.findAllByTestId('cine-block-skeleton')).toBeDefined()
  })

  it('should not display skeleton when data is loaded', async () => {
    mockuseOffersStocksFromOfferQuery.mockReturnValueOnce({
      ...defaultOffersStocksFromOfferQuery,
      isInitialLoading: false,
    })
    renderOfferCineContent()

    expect(screen.queryByTestId('cine-block-skeleton')).not.toBeOnTheScreen()
  })

  it('should display Button "Afficher plus de cinémas" when there is more cinemas', async () => {
    renderOfferCineContent()

    expect(await screen.findByText('Afficher plus de cinémas')).toBeOnTheScreen()
  })

  it('should display "Afficher plus de cinémas" when button is clicked and more movie Offers', async () => {
    mockUseGetVenuesByDay
      .mockReturnValueOnce({
        movieOffers: mockedMovieOffersLongResult,
        hasStocksOnlyAfter15Days: false,
      })
      .mockReturnValueOnce({
        movieOffers: mockedMovieOffersLongResult,
        hasStocksOnlyAfter15Days: false,
      })
      .mockReturnValueOnce({
        movieOffers: mockedMovieOffersLongResult,
        hasStocksOnlyAfter15Days: false,
      })
    renderOfferCineContent()

    const moreButton = await screen.findByText('Afficher plus de cinémas')
    await user.press(moreButton)

    await act(async () => {})

    expect(await screen.findByText('Afficher plus de cinémas')).toBeOnTheScreen()
  })

  it('should not display more cinema when Button "Afficher plus de cinémas" is clicked and end of movie Offers', async () => {
    renderOfferCineContent()

    const moreButton = await screen.findByText('Afficher plus de cinémas')
    await user.press(moreButton)

    await act(async () => {})

    expect(screen.queryByText('Afficher plus de cinémas')).not.toBeOnTheScreen()
  })
})

const renderOfferCineContent = () => {
  return render(
    reactQueryProviderHOC(
      <MovieCalendarProvider>
        <OfferCineContent onSeeVenuePress={jest.fn()} offer={mockOffer} />
      </MovieCalendarProvider>
    )
  )
}
