import React from 'react'

import { bookingsSnap } from 'features/bookings/api/bookingsSnap'
import { Ticket } from 'features/bookings/components/SwiperTickets/Ticket'
import { render } from 'tests/utils'

const booking = bookingsSnap.ongoing_bookings[1]

describe('<Ticket/>', () => {
  it('should display ticket without external bookings information if there are no external bookings', () => {
    booking.externalBookings = null
    const { queryByTestId } = render(<Ticket booking={booking} />)
    expect(queryByTestId('ticket-without-external-bookings-information')).toBeFalsy()
    expect(queryByTestId('ticket-with-external-bookings-information')).toBeFalsy()
  })

  it('should display ticket without external bookings information if there are no external bookings', () => {
    booking.externalBookings = []
    const { queryByTestId } = render(<Ticket booking={booking} />)
    queryByTestId('ticket-without-external-bookings-information')
  })

  it('should display one ticket with external bookings information if there are one external booking', () => {
    booking.externalBookings = [{ barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' }]
    const { queryByTestId } = render(<Ticket booking={booking} />)
    queryByTestId('ticket-with-external-bookings-information')
  })

  // TODO(LucasBeneston): fix this test for web
  it.skip('should display as many tickets as the number of tickets', () => {
    booking.externalBookings = [
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A13' },
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A14' },
    ]
    const { queryAllByTestId } = render(<Ticket booking={booking} />)
    expect(queryAllByTestId('ticket-with-external-bookings-information').length).toEqual(3)
  })

  describe('Swiper ticket controls', () => {
    it('should not show if number of ticket is equal to one', () => {
      booking.externalBookings = [{ barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' }]
      const { queryByTestId } = render(<Ticket booking={booking} />)
      expect(queryByTestId('swiper-tickets-controls')).toBeFalsy()
    })

    it('should show if number of ticket is greater than one', () => {
      booking.externalBookings = [
        { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
        { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A13' },
      ]
      const { queryByTestId } = render(<Ticket booking={booking} />)
      queryByTestId('swiper-tickets-controls')
    })
  })
})
