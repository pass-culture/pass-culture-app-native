import * as React from 'react'

import { useBooking, useBookingOffer } from 'features/bookOffer/pages/BookingOfferWrapper'
import { Step } from 'features/bookOffer/pages/reducer'
import { render, fireEvent } from 'tests/utils'

import { BookingEventChoices } from '../BookingEventChoices'

jest.mock('react-query')

const mockUseBooking = useBooking as jest.Mock
const mockUseBookingOffer = useBookingOffer as jest.Mock

const mockDispatch = jest.fn()

jest.mock('features/bookOffer/pages/BookingOfferWrapper', () => ({
  useBooking: jest.fn(() => ({
    bookingState: {
      offerId: undefined,
      stockId: undefined,
      step: undefined,
      quantity: undefined,
      date: undefined,
    },
    dispatch: jest.fn(),
  })),
  useBookingOffer: jest.fn(() => ({
    id: 1,
    isDuo: true,
  })),
  useBookingStock: jest.fn(() => ({
    price: '12€',
  })),
}))

jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({
    data: {
      id: 1,
      domainsCredit: { all: { remaining: 30000, initial: 50000 }, physical: null, digital: null },
    },
  })),
}))

jest.mock('features/offer/services/useHasEnoughCredit', () => ({
  useCreditForOffer: jest.fn(() => 50000),
}))

describe('<BookingEventChoices />', () => {
  it('should display only date step at beginning', () => {
    const page = render(<BookingEventChoices stocks={[]} />)
    expect(page.queryByTestId('DateStep')).toBeTruthy()
    expect(page.queryByTestId('HourStep')).toBeFalsy()
    expect(page.queryByTestId('DuoStep')).toBeFalsy()
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
    const page = render(<BookingEventChoices stocks={[]} />)
    expect(page.queryByTestId('DateStep')).toBeTruthy()
    expect(page.queryByTestId('HourStep')).toBeTruthy()
    expect(page.queryByTestId('DuoStep')).toBeFalsy()
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
    const page = render(<BookingEventChoices stocks={[]} />)
    expect(page.queryByTestId('DateStep')).toBeTruthy()
    expect(page.queryByTestId('HourStep')).toBeTruthy()
    expect(page.queryByTestId('DuoStep')).toBeTruthy()
  })

  it('should display date step and hour step and duo step on a snapshot', async () => {
    // eslint-disable-next-line local-rules/independant-mocks
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
    const page = render(<BookingEventChoices stocks={[]} />)
    expect(page.toJSON()).toMatchSnapshot()
  })

  it('should skip duo step if isDuo is not defined', async () => {
    // eslint-disable-next-line local-rules/independant-mocks
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
    // eslint-disable-next-line local-rules/independant-mocks
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

    const page = render(<BookingEventChoices stocks={[]} />)

    const hourBloc = page.getByTestId('HourChoice1')
    fireEvent.press(hourBloc)

    expect(page.queryByTestId('DuoStep')).toBeFalsy()
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_STOCK', payload: 1 })
  })
})
