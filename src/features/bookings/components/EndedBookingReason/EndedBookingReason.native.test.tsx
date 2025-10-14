import React from 'react'

import { BookingCancellationReasons } from 'api/gen'
import { EndedBookingReason } from 'features/bookings/components/EndedBookingReason/EndedBookingReason'
import { bookingsSnapV2 } from 'features/bookings/fixtures'
import { render, screen } from 'tests/utils'

describe('EndedBookingReason', () => {
  it('should return "Réservation utilisée" reason when date used defined', () => {
    const booking = { ...bookingsSnapV2.endedBookings[0], dateUsed: '2021-03-16T23:01:37.925926' }
    render(<EndedBookingReason booking={booking} />)

    expect(screen.getByText('Réservation utilisée')).toBeOnTheScreen()
  })

  it('should return "Annulée" reason when cancellation reason is OFFERER', () => {
    const booking = {
      ...bookingsSnapV2.endedBookings[0],
      cancellationReason: BookingCancellationReasons.OFFERER,
    }
    render(<EndedBookingReason booking={booking} />)

    expect(screen.getByText('Annulée')).toBeOnTheScreen()
  })

  it('should return "Réservation archivée" reason when booking is eligible for archieve and cancellation reason is null', () => {
    const booking = { ...bookingsSnapV2.endedBookings[0], cancellationReason: null }
    render(<EndedBookingReason booking={booking} isEligibleBookingsForArchiveValue />)

    expect(screen.getByText('Réservation archivée')).toBeOnTheScreen()
  })

  it('should return "Réservation annulée" reason when booking was cancelled by beneficiary', () => {
    const booking = {
      ...bookingsSnapV2.endedBookings[0],
      cancellationReason: BookingCancellationReasons.BENEFICIARY,
    }
    render(<EndedBookingReason booking={booking} />)

    expect(screen.getByText('Réservation annulée')).toBeOnTheScreen()
  })

  it('should return "Réservation annulée" reason when booking was expired', () => {
    const booking = {
      ...bookingsSnapV2.endedBookings[0],
      cancellationReason: BookingCancellationReasons.EXPIRED,
    }
    render(<EndedBookingReason booking={booking} />)

    expect(screen.getByText('Réservation annulée')).toBeOnTheScreen()
  })
})
