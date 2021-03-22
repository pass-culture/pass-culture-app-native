import { render, act, fireEvent } from '@testing-library/react-native'
import * as React from 'react'

import { useBooking, useBookingOffer } from 'features/bookOffer/pages/BookingOfferWrapper'
import { Step } from 'features/bookOffer/pages/reducer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { flushAllPromises } from 'tests/utils'

import { BookingEventChoices } from '../BookingEventChoices'

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
    data: { id: 1, expenses: [{ current: 12, limit: 200, domain: 'TEST' }] },
  })),
}))

jest.mock('features/offer/services/useHasEnoughCredit', () => ({
  useCreditForOffer: jest.fn(() => 20),
}))

describe('<BookingEventChoices />', () => {
  it('should display only date step at beginning', () => {
    const page = render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))
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
    const page = render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))
    await act(flushAllPromises)
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
    const page = render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))
    await act(flushAllPromises)
    expect(page.queryByTestId('DateStep')).toBeTruthy()
    expect(page.queryByTestId('HourStep')).toBeTruthy()
    expect(page.queryByTestId('DuoStep')).toBeTruthy()
  })

  it('should display date step and hour step and duo step on a snapshot', async () => {
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
    const page = render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))
    await act(flushAllPromises)
    expect(page.toJSON()).toMatchSnapshot()
  })
  it('should skip duo step if quantity is already selected', async () => {
    mockUseBooking.mockImplementation(() => ({
      bookingState: {
        offerId: 1,
        stockId: 1,
        step: Step.HOUR,
        quantity: 1,
        date: new Date('02/01/2021'),
      },
      dispatch: mockDispatch,
    }))
    mockUseBookingOffer.mockImplementation(() => ({
      id: 1,
      isDuo: true,
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

    const debouncedFunction = jest.fn()
    jest.spyOn(React, 'useRef').mockReturnValue({
      current: debouncedFunction,
    })

    const page = render(reactQueryProviderHOC(<BookingEventChoices stocks={[]} />))
    await act(flushAllPromises)

    const hourBloc = page.getByTestId('HourChoice1')
    fireEvent.press(hourBloc)

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SELECT_STOCK', payload: 1 })
    expect(debouncedFunction).toHaveBeenCalledWith({
      type: 'CHANGE_STEP',
      payload: Step.PRE_VALIDATION,
    })
  })
})
