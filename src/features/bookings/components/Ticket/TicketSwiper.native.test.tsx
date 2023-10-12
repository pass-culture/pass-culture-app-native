import React from 'react'

import { TicketSwiper } from 'features/bookings/components/Ticket/TicketSwiper'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { render, screen } from 'tests/utils'

const booking = bookingsSnap.ongoing_bookings[1]

describe('<TicketSwiper/>', () => {
  it('should display ticket without external bookings information if there are no external bookings (externalBookings is null)', () => {
    booking.externalBookings = null
    render(<TicketSwiper booking={booking} />)
    expect(
      screen.queryByTestId('ticket-without-external-bookings-information')
    ).not.toBeOnTheScreen()
    expect(screen.queryByTestId('ticket-with-external-bookings-information')).not.toBeOnTheScreen()
  })

  it('should display ticket without external bookings information if there are no external bookings (empty externalBookings array)', () => {
    booking.externalBookings = []
    render(<TicketSwiper booking={booking} />)
    expect(screen.queryByTestId('ticket-without-external-bookings-information')).toBeOnTheScreen()
  })

  it('should display one ticket with external bookings information if there are one external booking', () => {
    booking.externalBookings = [{ barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' }]
    render(<TicketSwiper booking={booking} />)
    expect(screen.queryByTestId('ticket-with-external-bookings-information')).toBeOnTheScreen()
  })

  it('should display as many tickets as the number of tickets', () => {
    booking.externalBookings = [
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A13' },
    ]
    render(<TicketSwiper booking={booking} />)
    expect(screen.queryAllByTestId('ticket-with-external-bookings-information').length).toEqual(2)
  })

  describe('Swiper ticket controls', () => {
    it('should not show if number of ticket is equal to one', () => {
      booking.externalBookings = [{ barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' }]
      render(<TicketSwiper booking={booking} />)
      expect(screen.queryByTestId('swiper-tickets-controls')).not.toBeOnTheScreen()
    })

    it('should show if number of ticket is greater than one', () => {
      booking.externalBookings = [
        { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
        { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A13' },
      ]
      render(<TicketSwiper booking={booking} />)
      expect(screen.queryByTestId('swiper-tickets-controls')).toBeOnTheScreen()
    })
  })
})
