import React from 'react'

import { bookingsWithExternalBookingInformationsSnap } from 'features/bookings/api/bookingsSnapWithExternalBookingInformations'
import { Ticket } from 'features/bookings/components/SwiperTickets/Ticket'
import { render } from 'tests/utils'

const booking = {
  ...bookingsWithExternalBookingInformationsSnap.ongoing_bookings[0],
}

describe('<Ticket/>', () => {
  it('should display TicketWithContent with externalBookingsInfos if externalBookingsInfos.lenght === 1', () => {
    booking.externalBookingsInfos = [{ barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' }]
    const { queryByTestId } = render(<Ticket booking={booking} />)
    queryByTestId('single-ticket-with-one-external-bookings-information')
  })

  it('should display SwiperTickets if externalBookingsInfos.lenght > 1', () => {
    booking.externalBookingsInfos = [
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A12' },
      { barcode: 'PASSCULTURE:v3;TOKEN:352UW4', seat: 'A13' },
    ]
    const { queryByTestId } = render(<Ticket booking={booking} />)
    queryByTestId('swiper-ticket')
  })

  it('should display TicketWithContent without externalBookingsInfos if externalBookingsInfos is undefined', () => {
    booking.externalBookingsInfos = undefined
    const { queryByTestId } = render(<Ticket booking={booking} />)
    queryByTestId('single-ticket-without-external-bookings-information')
  })

  describe('activationCodeFeatureEnabled & token', () => {
    it('should display the booking token when activationCodeFeatureEnabled is false', () => {
      booking.activationCode = { code: 'someCode' }
      const { getByText, queryByText } = render(
        <Ticket booking={booking} activationCodeFeatureEnabled={false} />
      )
      getByText(booking.token)
      expect(queryByText(booking.activationCode.code)).toBeFalsy()
    })
    it('should display the booking activation code when activationCodeFeatureEnabled is true', () => {
      booking.activationCode = { code: 'someCode' }
      const { getByText, queryByText } = render(
        <Ticket booking={booking} activationCodeFeatureEnabled={true} />
      )
      getByText(booking.activationCode.code)
      expect(queryByText(booking.token)).toBeFalsy()
    })
  })
})
