import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { Booking } from 'features/bookings/types'
import { fireEvent, render } from 'tests/utils/web'

import { OnGoingBookingItem } from './OnGoingBookingItem'

describe('OnGoingBookingItem', () => {
  const booking: Booking = bookingsSnap.ongoing_bookings[0]

  it('should navigate to the booking details page', () => {
    const { getByTestId } = renderOnGoingBookingItem(booking)

    const item = getByTestId(/Réservation de l’offre/)
    fireEvent.click(item)

    expect(navigate).toHaveBeenCalledWith('BookingDetails', { id: 123 })
  })
})

function renderOnGoingBookingItem(booking: Booking) {
  return render(<OnGoingBookingItem booking={booking} />)
}
