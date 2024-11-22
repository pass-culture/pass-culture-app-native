import React from 'react'

import * as MovieCalendarContext from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { OfferCineContent } from 'features/offer/components/OfferCine/OfferCineContent'
import * as useGetVenuesByDayModule from 'features/offer/helpers/useGetVenueByDay/useGetVenuesByDay'
import { LocationMode, Position } from 'libs/location/types'
import { mockBuilder } from 'tests/mockBuilder'
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

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

const mockOffer = mockBuilder.offerResponseV2({})

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
const mockDisplayCalendar = jest.fn()

describe('OfferCineContent', () => {
  beforeEach(() => {
    jest.spyOn(MovieCalendarContext, 'useMovieCalendar').mockReturnValue({
      selectedDate: mockSelectedDate,
      goToDate: mockGoToDate,
      displayCalendar: mockDisplayCalendar,
    })
  })

  it('should display skeleton when data is loading', () => {
    spyUseGetVenuesByDay.mockReturnValueOnce({
      ...useGetVenueByDayReturn,
      isLoading: true,
    })

    render(<OfferCineContent onSeeVenuePress={jest.fn()} offer={mockOffer} />)

    expect(screen.getByTestId('cine-block-skeleton')).toBeOnTheScreen()
  })

  it('should not display skeleton when data is loaded', async () => {
    spyUseGetVenuesByDay.mockReturnValueOnce({ ...useGetVenueByDayReturn, isLoading: false })

    render(<OfferCineContent onSeeVenuePress={jest.fn()} offer={mockOffer} />)

    expect(screen.queryByTestId('cine-block-skeleton')).not.toBeOnTheScreen()
  })
})
