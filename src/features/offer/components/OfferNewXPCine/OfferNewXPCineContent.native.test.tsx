import React from 'react'

import * as MovieCalendarContext from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { offerResponseBuilder } from 'features/offer/components/MoviesScreeningCalendar/offersStockResponse.builder'
import { OfferNewXPCineContent } from 'features/offer/components/OfferNewXPCine/OfferNewXPCineContent'
import * as useGetVenuesByDayModule from 'features/offer/helpers/useGetVenueByDay/useGetVenuesByDay'
import { LocationMode, Position } from 'libs/location/types'
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

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

const mockOffer = offerResponseBuilder().build()

const useGetVenueByDayReturn: ReturnType<(typeof useGetVenuesByDayModule)['useGetVenuesByDay']> = {
  items: [],
  isLoading: true,
  increaseCount: jest.fn(),
  isEnd: false,
  hasStocksOnlyAfter15Days: false,
}

const spyUseGetVenuesByDay = jest.spyOn(useGetVenuesByDayModule, 'useGetVenuesByDay')

const mockSelectedDate = new Date('2023-05-01')
const mockGoToDate = jest.fn()

describe('OfferNewXPCineContent', () => {
  beforeEach(() => {
    jest.spyOn(MovieCalendarContext, 'useMovieCalendar').mockReturnValue({
      selectedDate: mockSelectedDate,
      goToDate: mockGoToDate,
    })
  })

  it('should display skeleton when data is loading', () => {
    spyUseGetVenuesByDay.mockReturnValueOnce({
      ...useGetVenueByDayReturn,
      isLoading: true,
    })

    render(<OfferNewXPCineContent onSeeVenuePress={jest.fn()} offer={mockOffer} />)

    expect(screen.getByTestId('cine-block-skeleton')).toBeOnTheScreen()
  })

  it('should not display skeleton when data is loaded', async () => {
    spyUseGetVenuesByDay.mockReturnValueOnce({ ...useGetVenueByDayReturn, isLoading: false })

    render(<OfferNewXPCineContent onSeeVenuePress={jest.fn()} offer={mockOffer} />)

    expect(screen.queryByTestId('cine-block-skeleton')).not.toBeOnTheScreen()
  })
})
