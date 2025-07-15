import React from 'react'

import { MovieCalendarProvider } from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { OfferCineContent } from 'features/offer/components/OfferCine/OfferCineContent'
import { LocationMode, Position } from 'libs/location/types'
import { mockBuilder } from 'tests/mockBuilder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

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

jest.mock('features/offer/helpers/useGetVenueByDay/useGetVenuesByDay', () => ({
  useGetVenuesByDay: () => ({
    movieOffers: [],
  }),
  getDaysWithNoScreenings: jest.fn(),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

const mockOffer = mockBuilder.offerResponseV2({})

describe('OfferCineContent', () => {
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
