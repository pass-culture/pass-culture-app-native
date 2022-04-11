import { addDays, formatISO } from 'date-fns'
import React from 'react'

import { WithdrawalTypeEnum } from 'api/gen'
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
    const initialBooking = {
      ...bookingsSnap.ongoing_bookings[0],
      stock: {
        ...bookingsSnap.ongoing_bookings[0].stock,
        offer: {
          ...bookingsSnap.ongoing_bookings[0].stock.offer,
          isDigital: false,
        },
      },
    }

    it('should not display button for email consultation if by email collect and delay is specified and email normally received', () => {
      const booking = {
        ...initialBooking,
        confirmationDate: formatISO(new Date()).slice(0, -1),
        stock: {
          ...initialBooking.stock,
          beginningDatetime: formatISO(addDays(new Date(), 2)).slice(0, -1),
          offer: {
            ...initialBooking.stock.offer,
            isDigital: false,
            withdrawalType: WithdrawalTypeEnum.by_email,
            withdrawalDelay: 60 * 60 * 24 * 2,
          },
        },
      }

      const { queryByTestId } = render(
        <BookingDetailsTicketContent booking={booking} proDisableEventsQrcode={true} />
      )

      expect(queryByTestId('collect-info-email-btn')).toBeFalsy()
    })

    it('should not display button for email consultation if by email collect and the event is today', () => {
      const booking = {
        ...initialBooking,
        confirmationDate: formatISO(addDays(new Date(), -2)).slice(0, -1),
        stock: {
          ...initialBooking.stock,
          beginningDatetime: formatISO(new Date()).slice(0, -1),
          offer: {
            ...initialBooking.stock.offer,
            withdrawalType: WithdrawalTypeEnum.by_email,
            withdrawalDelay: 0,
          },
        },
      }

      const { queryByTestId } = render(
        <BookingDetailsTicketContent booking={booking} proDisableEventsQrcode={true} />
      )

      expect(queryByTestId('collect-info-email-btn')).toBeFalsy()
    })
  })
})
