import React from 'react'

import { bookingsWithExternalBookingInformationsSnap } from 'features/bookings/api/bookingsSnapWithExternalBookingInformations'
import { SwiperTickets } from 'features/bookings/components/SwiperTickets/SwiperTickets'
import { render } from 'tests/utils'

const booking = bookingsWithExternalBookingInformationsSnap.ongoing_bookings[0]

describe('<SwiperTickets/>', () => {
  it('should render properly', () => {
    const renderAPI = render(<SwiperTickets booking={booking} />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display as many tickets as the number of tickets', () => {
    booking.externalBookingsInfos = [
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A13' },
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A14' },
    ]
    const { queryAllByTestId } = render(<SwiperTickets booking={booking} />)
    expect(queryAllByTestId('three-shapes-ticket').length).toEqual(3)
  })

  describe('Swiper ticket controls', () => {
    it('should not show if number of ticket === 0', () => {
      booking.externalBookingsInfos = undefined
      const { queryByTestId } = render(<SwiperTickets booking={booking} />)
      expect(queryByTestId('swiper-tickets-controls')).toBeFalsy()
    })

    it('should not show if number of ticket === 1', () => {
      booking.externalBookingsInfos = [{ barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' }]
      const { queryByTestId } = render(<SwiperTickets booking={booking} />)
      expect(queryByTestId('swiper-tickets-controls')).toBeFalsy()
    })

    it('should show if number of ticket > 1', () => {
      booking.externalBookingsInfos = [
        { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
        { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A13' },
      ]
      const { queryByTestId } = render(<SwiperTickets booking={booking} />)
      queryByTestId('swiper-tickets-controls')
    })
  })
})
