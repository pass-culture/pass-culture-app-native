import React from 'react'

import { analytics } from 'libs/analytics'
import { flushAllPromises, render } from 'tests/utils'

import { bookingsSnap as mockBookings } from '../api/bookingsSnap'

import { OnGoingBookingsList } from './OnGoingBookingsList'

jest.mock('react-query')
jest.mock('features/bookings/api/queries', () => ({
  useBookings: jest.fn(() => ({ data: mockBookings })),
}))

describe('<OnGoingBookingsList /> - Analytics', () => {
  const nativeEventMiddle = {
    layoutMeasurement: { height: 1000 },
    contentOffset: { y: 400 }, // how far did we scroll
    contentSize: { height: 1600 },
  }
  const nativeEventBottom = {
    layoutMeasurement: { height: 1000 },
    contentOffset: { y: 900 },
    contentSize: { height: 1600 },
  }

  it('should trigger logEvent "BookingsScrolledToBottom" when reaching the end', () => {
    const { getByTestId } = render(<OnGoingBookingsList />)
    const flatList = getByTestId('OnGoingBookingsList')

    flatList.props.onScroll({ nativeEvent: nativeEventMiddle })
    expect(analytics.logBookingsScrolledToBottom).not.toHaveBeenCalled()

    flatList.props.onScroll({ nativeEvent: nativeEventBottom })

    expect(analytics.logBookingsScrolledToBottom).toHaveBeenCalledTimes(1)
  })

  it('should trigger logEvent "BookingsScrolledToBottom" only once', () => {
    const { getByTestId } = render(<OnGoingBookingsList />)
    const flatList = getByTestId('OnGoingBookingsList')

    // 1st scroll to bottom => trigger
    flatList.props.onScroll({ nativeEvent: nativeEventBottom })
    expect(analytics.logBookingsScrolledToBottom).toHaveBeenCalledTimes(1)

    // 2nd scroll to bottom => NOT trigger
    flatList.props.onScroll({ nativeEvent: nativeEventMiddle })
    flatList.props.onScroll({ nativeEvent: nativeEventBottom })
    flushAllPromises()

    expect(analytics.logBookingsScrolledToBottom).toHaveBeenCalledTimes(1)
  })
})
