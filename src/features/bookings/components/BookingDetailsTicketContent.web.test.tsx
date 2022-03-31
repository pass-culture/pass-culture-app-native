import React from 'react'

import { BookingDetailsTicketContent } from 'features/bookings/components/BookingDetailsTicketContent'
import { render } from 'tests/utils/web'

import { bookingsSnap } from '../api/bookingsSnap'

describe('BookingDetailsTicketContent', () => {
  describe('activationCodeFeatureEnabled & token', () => {
    it('should display the booking token when activationCodeFeatureEnabled is false', () => {
      const booking = { ...bookingsSnap.ongoing_bookings[0], activationCode: { code: 'someCode' } }
      const { getByText, queryByText } = render(
        <BookingDetailsTicketContent booking={booking} activationCodeFeatureEnabled={false} />
      )

      getByText(booking.token)
      expect(queryByText(booking.activationCode.code)).toBeFalsy()
    })
    it('should display the booking activation code when activationCodeFeatureEnabled is true', () => {
      const booking = { ...bookingsSnap.ongoing_bookings[0], activationCode: { code: 'someCode' } }
      const { getByText, queryByText } = render(
        <BookingDetailsTicketContent booking={booking} activationCodeFeatureEnabled={true} />
      )

      getByText(booking.activationCode.code)
      expect(queryByText(booking.token)).toBeFalsy()
    })
  })

  describe('proDisableEventsQrcode & QR code display', () => {
    it('should display the QR code when proDisableEventsQrcode is false', () => {
      const booking = bookingsSnap.ongoing_bookings[0]
      booking.stock.offer.isDigital = false
      const { getByTestId } = render(
        <BookingDetailsTicketContent booking={booking} proDisableEventsQrcode={false} />
      )
      getByTestId('qr-code')
    })

    it('should not display the QR code when proDisableEventsQrcode is true', () => {
      const booking = bookingsSnap.ongoing_bookings[0]
      booking.stock.offer.isDigital = false
      const { queryByTestId } = render(
        <BookingDetailsTicketContent booking={booking} proDisableEventsQrcode={true} />
      )

      expect(queryByTestId('qr-code')).toBeFalsy()
    })
  })
})
