import * as React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { Step } from 'features/bookOffer/context/reducer'
import { useBookingContext } from 'features/bookOffer/context/useBookingContext'
import { useBookingOffer } from 'features/bookOffer/helpers/useBookingOffer'
import { render, fireEvent, screen } from 'tests/utils'

import { BookingEventChoices } from './BookingEventChoices'

jest.mock('react-query')
jest.mock('features/auth/context/AuthContext')

const mockUseBooking = useBookingContext as jest.Mock
const mockUseBookingOffer = useBookingOffer as jest.Mock

const mockDispatch = jest.fn()

jest.mock('features/bookOffer/context/useBookingContext', () => ({
  useBookingContext: jest.fn(() => ({
    bookingState: {
      offerId: undefined,
      stockId: undefined,
      step: undefined,
      quantity: undefined,
      date: undefined,
    },
    dispatch: jest.fn(),
  })),
}))

jest.mock('features/bookOffer/helpers/useBookingOffer', () => ({
  useBookingOffer: jest.fn(() => ({
    id: 1,
    isDuo: true,
  })),
}))

jest.mock('features/bookOffer/helpers/useBookingStock', () => ({
  useBookingStock: jest.fn(() => ({
    price: '12€',
  })),
}))

jest.mock('features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit', () => ({
  useCreditForOffer: jest.fn(() => 50000),
}))

describe('<BookingEventChoices />', () => {
  beforeAll(() => {
    const mockUseAuthContext = useAuthContext as jest.Mock
    const { user: globalUserMock } = mockUseAuthContext()

    mockUseAuthContext.mockReturnValue({
      user: {
        ...globalUserMock,
        id: 1,
        domainsCredit: { all: { remaining: 30000, initial: 50000 }, physical: null, digital: null },
      },
    })
  })
  it('should display only date step at beginning', () => {
    render(<BookingEventChoices stocks={[]} />)
    expect(screen.queryByTestId('DateStep')).toBeOnTheScreen()
    expect(screen.queryByTestId('HourStep')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('DuoStep')).not.toBeOnTheScreen()
  })

  it('should display date step and hour step', async () => {
    mockUseBooking.mockImplementationOnce(() => ({
      bookingState: {
        offerId: 1,
        stockId: 1,
        step: Step.HOUR,
        quantity: undefined,
        date: '01/02/2021',
      },
      dispatch: jest.fn(),
    }))
    render(<BookingEventChoices stocks={[]} />)
    expect(screen.queryByTestId('DateStep')).toBeOnTheScreen()
    expect(screen.queryByTestId('HourStep')).toBeOnTheScreen()
    expect(screen.queryByTestId('DuoStep')).not.toBeOnTheScreen()
  })

  it('should display date step and hour step and duo step', async () => {
    mockUseBooking.mockImplementationOnce(() => ({
      bookingState: {
        offerId: 1,
        stockId: 1,
        step: Step.DUO,
        quantity: 1,
        date: '01/02/2021',
      },
      dispatch: jest.fn(),
    }))
    render(<BookingEventChoices stocks={[]} />)
    expect(screen.queryByTestId('DateStep')).toBeOnTheScreen()
    expect(screen.queryByTestId('HourStep')).toBeOnTheScreen()
    expect(screen.queryByTestId('DuoStep')).toBeOnTheScreen()
  })

  it('should display date step and hour step and duo step on a snapshot', async () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseBooking.mockImplementation(() => ({
      bookingState: {
        offerId: 1,
        stockId: 1,
        step: Step.DUO,
        quantity: 1,
        date: new Date('01/02/2021'),
      },
      dispatch: jest.fn(),
    }))
    render(<BookingEventChoices stocks={[]} />)
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('should skip duo step if isDuo is not defined', async () => {
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseBooking.mockImplementation(() => ({
      bookingState: {
        offerId: 1,
        stockId: 1,
        step: Step.HOUR,
        quantity: undefined,
        date: new Date('02/01/2021'),
      },
      dispatch: mockDispatch,
    }))
    // eslint-disable-next-line local-rules/independent-mocks
    mockUseBookingOffer.mockImplementation(() => ({
      id: 1,
      isDuo: false,
      stocks: [
        {
          id: 1,
          beginningDatetime: new Date('2021-02-01T20:00:00'),
          bookingLimitDatetime: new Date('2021-02-01T20:00:00'),
          cancellationLimitDatetime: new Date('2021-02-01T12:14:57.081907'),
          isBookable: true,
          price: 2400,
          features: [],
        },
      ],
    }))

    render(<BookingEventChoices stocks={[]} />)

    const hourBloc = screen.getByTestId('HourChoice1-label')
    fireEvent.press(hourBloc)

    expect(screen.queryByTestId('DuoStep')).not.toBeOnTheScreen()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_STOCK', payload: 1 })
  })

  describe('when stock id and quantity not selected', () => {
    beforeEach(() => {
      mockUseBooking.mockReturnValue({
        bookingState: {
          offerId: 1,
          stockId: undefined,
          step: Step.DATE,
          quantity: undefined,
          date: new Date('01/02/2021'),
        },
        dispatch: mockDispatch,
      })
    })

    it('should display "Choisir les options"', () => {
      render(<BookingEventChoices stocks={[]} />)
      expect(screen.getByText('Choisir les options')).toBeOnTheScreen()
    })

    it('should not change step when the button is disabled', () => {
      render(<BookingEventChoices stocks={[]} />)
      fireEvent.press(screen.getByText('Choisir les options'))
      expect(mockDispatch).not.toHaveBeenCalled()
    })
  })

  describe('when stock id and quantity selected', () => {
    beforeEach(() => {
      mockUseBooking.mockReturnValue({
        bookingState: {
          offerId: 1,
          stockId: 1,
          step: Step.DATE,
          quantity: 1,
          date: new Date('01/02/2021'),
        },
        dispatch: mockDispatch,
      })
    })

    it('should display "Valider ces options"', () => {
      render(<BookingEventChoices stocks={[]} />)
      expect(screen.getByText('Valider ces options')).toBeOnTheScreen()
    })

    it('should change step to confirmation screen when the button is enabled', () => {
      render(<BookingEventChoices stocks={[]} />)
      fireEvent.press(screen.getByText('Valider ces options'))
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'VALIDATE_OPTIONS' })
    })
  })

  it('should not display button when prices by categories feature flag disabled', () => {
    render(<BookingEventChoices stocks={[]} enablePricesByCategories />)
    expect(
      screen.queryByTestId('modalButtonWithoutEnabledPricesByCategories')
    ).not.toBeOnTheScreen()
  })
})
