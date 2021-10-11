import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { fireEvent, render } from 'tests/utils/web'

import { bookingsSnap } from '../api/bookingsSnap'

import { OnGoingBookingItem } from './OnGoingBookingItem'
import { Booking } from './types'

jest.mock('features/auth/settings')

describe('OnGoingBookingItem', () => {
  const booking: Booking = bookingsSnap.ongoing_bookings[0]

  it('should navigate to the booking details page', () => {
    const { getByTestId } = renderOnGoingBookingItem(booking)

    const item = getByTestId('OnGoingBookingItem')
    fireEvent.click(item)

    expect(navigate).toHaveBeenCalledWith('BookingDetails', { id: 123 })
  })
})

function renderOnGoingBookingItem(booking: Booking) {
  return render(<OnGoingBookingItem booking={booking} />)
}
