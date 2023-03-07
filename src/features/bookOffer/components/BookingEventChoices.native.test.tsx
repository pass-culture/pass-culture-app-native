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
    render(<BookingEventChoices stocks={[]} enablePricesByCategories={false} />)
    expect(screen.queryByTestId('DateStep')).toBeTruthy()
    expect(screen.queryByTestId('HourStep')).toBeNull()
    expect(screen.queryByTestId('DuoStep')).toBeNull()
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
    render(<BookingEventChoices stocks={[]} enablePricesByCategories={false} />)
    expect(screen.queryByTestId('DateStep')).toBeTruthy()
    expect(screen.queryByTestId('HourStep')).toBeTruthy()
    expect(screen.queryByTestId('DuoStep')).toBeNull()
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
    render(<BookingEventChoices stocks={[]} enablePricesByCategories={false} />)
    expect(screen.queryByTestId('DateStep')).toBeTruthy()
    expect(screen.queryByTestId('HourStep')).toBeTruthy()
    expect(screen.queryByTestId('DuoStep')).toBeTruthy()
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
    render(<BookingEventChoices stocks={[]} enablePricesByCategories={false} />)
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
        },
      ],
    }))

    render(<BookingEventChoices stocks={[]} enablePricesByCategories={false} />)

    const hourBloc = screen.getByTestId('HourChoice1-hour')
    fireEvent.press(hourBloc)

    expect(screen.queryByTestId('DuoStep')).toBeNull()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_STOCK', payload: 1 })
  })

  it('should not display "Étape 1 sur 3" when offer is duo', () => {
    render(<BookingEventChoices stocks={[]} offerIsDuo enablePricesByCategories={false} />)
    expect(screen.queryByText('Étape 1 sur 3')).toBeNull()
  })

  it('should not display "Étape 1 sur 2" when offer is not duo', () => {
    render(<BookingEventChoices stocks={[]} enablePricesByCategories={false} />)
    expect(screen.queryByText('Étape 1 sur 2')).toBeNull()
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
      render(<BookingEventChoices stocks={[]} enablePricesByCategories={false} />)
      expect(screen.getByText('Choisir les options')).toBeTruthy()
    })

    it('should not change step when the button is disabled', () => {
      render(<BookingEventChoices stocks={[]} enablePricesByCategories={false} />)
      fireEvent.press(screen.getByText('Choisir les options'))
      expect(mockDispatch).toHaveBeenCalledTimes(0)
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
      render(<BookingEventChoices stocks={[]} enablePricesByCategories={false} />)
      expect(screen.getByText('Valider ces options')).toBeTruthy()
    })

    it('should change step to confirmation screen when the button is enabled', () => {
      render(<BookingEventChoices stocks={[]} enablePricesByCategories={false} />)
      fireEvent.press(screen.getByText('Valider ces options'))
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'VALIDATE_OPTIONS' })
    })
  })

  describe('when prices by category feature flag activated', () => {})
})
