import React from 'react'

import * as MovieCalendarContext from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { NEXT_SCREENING_WORDING } from 'features/offer/components/MoviesScreeningCalendar/NextScreeningButton'
import {
  offerResponseBuilder,
  venueBuilder,
} from 'features/offer/components/MoviesScreeningCalendar/offersStockResponse.builder'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render, screen } from 'tests/utils'

import { CineBlock, CineBlockProps } from './CineBlock'

jest.mock('features/offer/components/MoviesScreeningCalendar/MovieCalendarContext', () => ({
  useMovieCalendar: jest.fn(),
}))

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('libs/firebase/analytics/analytics')
jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

const mockOfferTitle = 'CINEMA DE LA RUE'
const mockOfferVenue = venueBuilder().withName(mockOfferTitle).build()
const mockOffer = offerResponseBuilder().withVenue(mockOfferVenue).build()

const mockSelectedDate = new Date('2023-05-01')
const mockGoToDate = jest.fn()

describe('CineBlock', () => {
  beforeEach(() => {
    jest.spyOn(MovieCalendarContext, 'useMovieCalendar').mockReturnValue({
      selectedDate: mockSelectedDate,
      goToDate: mockGoToDate,
    })
  })

  it('should render VenueBlock', () => {
    renderCineBlock({ offer: mockOffer })

    expect(screen.getByText(mockOfferTitle)).toBeOnTheScreen()
  })

  it('should render NextScreeningButton when nextDate is provided', async () => {
    const nextDate = new Date('2023-05-02')
    renderCineBlock({ nextDate })

    expect(await screen.findByText(NEXT_SCREENING_WORDING)).toBeOnTheScreen()
  })

  it('should render OfferEventCardList when nextDate is not provided', () => {
    renderCineBlock({})

    expect(screen.getByTestId('offer-event-card-list')).toBeOnTheScreen()
  })

  it('should call onSeeVenuePress when provided', () => {
    const mockOnSeeVenuePress = jest.fn()
    renderCineBlock({ onSeeVenuePress: mockOnSeeVenuePress })
    const seeVenueButton = screen.getByText(mockOfferTitle)

    fireEvent.press(seeVenueButton)

    expect(mockOnSeeVenuePress).toHaveBeenCalledTimes(1)
  })

  it('should call goToDate when NextScreeningButton is pressed', async () => {
    const nextDate = new Date('2023-05-02')
    renderCineBlock({ nextDate })
    const nextScreeningButton = await screen.findByText(NEXT_SCREENING_WORDING)

    fireEvent.press(nextScreeningButton)

    expect(mockGoToDate).toHaveBeenCalledWith(nextDate)
  })
})

const renderCineBlock = (props: Partial<CineBlockProps>) => {
  return render(<CineBlock {...props} offer={mockOffer} />, {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })
}
