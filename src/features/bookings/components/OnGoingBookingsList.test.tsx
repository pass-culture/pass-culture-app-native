import React from 'react'

import { analytics } from 'libs/analytics'
import { flushAllPromises, render, act } from 'tests/utils'

import { bookingsSnap } from '../api/bookingsSnap'

import { OnGoingBookingsList } from './OnGoingBookingsList'

describe('<OnGoingBookingsList /> - Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
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

  it('should trigger logEvent "BookingsScrolledToBottom" when reaching the end', async () => {
    const { getByTestId } = await renderBookings()
    const flatList = getByTestId('OnGoingBookingsList')
    await act(async () => {
      await flushAllPromises()
    })

    await act(async () => {
      await flatList.props.onScroll({ nativeEvent: nativeEventMiddle })
    })
    expect(analytics.logBookingsScrolledToBottom).not.toHaveBeenCalled()

    await act(async () => {
      await flatList.props.onScroll({ nativeEvent: nativeEventBottom })
    })

    expect(analytics.logBookingsScrolledToBottom).toHaveBeenCalledTimes(1)
  })

  it('should trigger logEvent "BookingsScrolledToBottom" only once', async () => {
    const { getByTestId } = await renderBookings()
    const flatList = getByTestId('OnGoingBookingsList')

    await act(async () => {
      await flushAllPromises()
    })

    await act(async () => {
      // 1st scroll to bottom => trigger
      await flatList.props.onScroll({ nativeEvent: nativeEventBottom })
      await flushAllPromises()
    })
    expect(analytics.logBookingsScrolledToBottom).toHaveBeenCalledTimes(1)

    await act(async () => {
      // 2nd scroll to bottom => NOT trigger
      await flatList.props.onScroll({ nativeEvent: nativeEventMiddle })
      await flatList.props.onScroll({ nativeEvent: nativeEventBottom })
      await flushAllPromises()
    })

    expect(analytics.logBookingsScrolledToBottom).toHaveBeenCalledTimes(1)
  })
})

async function renderBookings() {
  const renderAPI = render(
    <OnGoingBookingsList
      bookings={bookingsSnap.ongoing_bookings}
      endedBookings={bookingsSnap.ended_bookings}
    />
  )
  return renderAPI
}
