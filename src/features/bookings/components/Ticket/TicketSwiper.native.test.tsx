import React from 'react'

import { TicketSwiper } from 'features/bookings/components/Ticket/TicketSwiper'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { render, screen } from 'tests/utils'

const booking = bookingsSnap.ongoing_bookings[1]

describe('<TicketSwiper/>', () => {
  it('should display ticket without external bookings information if there are no external bookings (externalBookings is null)', () => {
    // @ts-expect-error: because of noUncheckedIndexedAccess
    booking.externalBookings = null
    // @ts-expect-error: because of noUncheckedIndexedAccess
    render(<TicketSwiper booking={booking} />)

    expect(
      screen.queryByTestId('ticket-without-external-bookings-information')
    ).not.toBeOnTheScreen()
    expect(screen.queryByTestId('ticket-with-external-bookings-information')).not.toBeOnTheScreen()
  })

  it('should display ticket without external bookings information if there are no external bookings (empty externalBookings array)', () => {
    // @ts-expect-error: because of noUncheckedIndexedAccess
    booking.externalBookings = []
    // @ts-expect-error: because of noUncheckedIndexedAccess
    render(<TicketSwiper booking={booking} />)

    expect(screen.queryByTestId('ticket-without-external-bookings-information')).toBeOnTheScreen()
  })

  it('should display one ticket with external bookings information if there are one external booking', () => {
    // @ts-expect-error: because of noUncheckedIndexedAccess
    booking.externalBookings = [{ barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' }]
    // @ts-expect-error: because of noUncheckedIndexedAccess
    render(<TicketSwiper booking={booking} />)

    expect(screen.queryByTestId('ticket-with-external-bookings-information')).toBeOnTheScreen()
  })

  it('should display as many tickets as the number of tickets', () => {
    // @ts-expect-error: because of noUncheckedIndexedAccess
    booking.externalBookings = [
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A13' },
    ]
    // @ts-expect-error: because of noUncheckedIndexedAccess
    render(<TicketSwiper booking={booking} />)

    expect(screen.queryAllByTestId('ticket-with-external-bookings-information')).toHaveLength(2)
  })

  describe('Swiper ticket controls', () => {
    it('should not show if number of ticket is equal to one', () => {
      // @ts-expect-error: because of noUncheckedIndexedAccess
      booking.externalBookings = [{ barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' }]
      // @ts-expect-error: because of noUncheckedIndexedAccess
      render(<TicketSwiper booking={booking} />)

      expect(screen.queryByTestId('swiper-tickets-controls')).not.toBeOnTheScreen()
    })

    it('should show if number of ticket is greater than one', () => {
      // @ts-expect-error: because of noUncheckedIndexedAccess
      booking.externalBookings = [
        { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
        { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A13' },
      ]
      // @ts-expect-error: because of noUncheckedIndexedAccess
      render(<TicketSwiper booking={booking} />)

      expect(screen.queryByTestId('swiper-tickets-controls')).toBeOnTheScreen()
    })
  })
})
