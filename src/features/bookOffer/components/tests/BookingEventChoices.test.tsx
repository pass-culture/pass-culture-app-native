import { render, act } from '@testing-library/react-native'
import React from 'react'

import { useBooking } from 'features/bookOffer/pages/BookingOfferWrapper'
import { Step } from 'features/bookOffer/pages/reducer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { flushAllPromises } from 'tests/utils'

import { BookingEventChoices } from '../BookingEventChoices'

const mockUseBooking = useBooking as jest.Mock
jest.mock('features/bookOffer/pages/BookingOfferWrapper', () => ({
  useBooking: jest.fn(() => ({
    bookingState: {
      offerId: undefined,
      stockId: undefined,
      step: undefined,
      quantity: 1,
      date: undefined,
    },
    dispatch: jest.fn(),
  })),
  useBookingOffer: jest.fn(() => ({
    id: 1,
    isDuo: true,
  })),
}))

jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({
    data: { id: 1, expenses: [{ current: 12, limit: 200, domain: 'TEST' }] },
  })),
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
        quantity: 1,
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
})
