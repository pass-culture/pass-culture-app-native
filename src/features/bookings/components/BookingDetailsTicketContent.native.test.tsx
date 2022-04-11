import { addDays, formatISO } from 'date-fns'
import React from 'react'

import { BookingDetailsTicketContent } from 'features/bookings/components/BookingDetailsTicketContent'
import { OFFER_WITHDRAWAL_TYPE_OPTIONS } from 'features/bookings/components/types'
import { render } from 'tests/utils'

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
    it('should display the QR code when proDisableEventsQrcode is false', () => {
      const { getByTestId } = render(
        <BookingDetailsTicketContent booking={initialBooking} proDisableEventsQrcode={false} />
      )
      getByTestId('qr-code')
    })

    it('should not display the QR code when proDisableEventsQrcode is true', () => {
      const { queryByTestId } = render(
        <BookingDetailsTicketContent booking={initialBooking} proDisableEventsQrcode={true} />
      )

      expect(queryByTestId('qr-code')).toBeFalsy()
    })

    it('should not display on site collect wording if type collect is not on site', () => {
      const { queryByTestId } = render(
        <BookingDetailsTicketContent booking={initialBooking} proDisableEventsQrcode={true} />
      )

      expect(queryByTestId('collect-info')).toBeFalsy()
    })

    describe('should display collect wording', () => {
      it('should display on site collect delay when delay is specified', () => {
        const booking = {
          ...initialBooking,
          stock: {
            ...initialBooking.stock,
            offer: {
              ...initialBooking.stock.offer,
              withdrawalType: OFFER_WITHDRAWAL_TYPE_OPTIONS.ON_SITE,
              withdrawalDelay: 60 * 60 * 2,
            },
          },
        }

        const { getByTestId } = render(
          <BookingDetailsTicketContent booking={booking} proDisableEventsQrcode={true} />
        )
        getByTestId('collect-info-delay')
      })

      it('should not display on site collect delay when delay is not specified', () => {
        const booking = {
          ...initialBooking,
          stock: {
            ...initialBooking.stock,
            offer: {
              ...initialBooking.stock.offer,
              withdrawalType: OFFER_WITHDRAWAL_TYPE_OPTIONS.ON_SITE,
              withdrawalDelay: 0,
            },
          },
        }
        const { queryByTestId } = render(
          <BookingDetailsTicketContent booking={booking} proDisableEventsQrcode={true} />
        )
        expect(queryByTestId('collect-info-delay')).toBeFalsy()
      })

      it('should display by email collect delay when delay is specified and email is not received yet', () => {
        const booking = {
          ...initialBooking,
          confirmationDate: formatISO(new Date()).slice(0, -1),
          stock: {
            ...initialBooking.stock,
            beginningDatetime: formatISO(addDays(new Date(), 3)).slice(0, -1),
            offer: {
              ...initialBooking.stock.offer,
              withdrawalType: OFFER_WITHDRAWAL_TYPE_OPTIONS.BY_EMAIL,
              withdrawalDelay: 60 * 60 * 24 * 2,
            },
          },
        }
        const { getByTestId } = render(
          <BookingDetailsTicketContent booking={booking} proDisableEventsQrcode={true} />
        )
        getByTestId('collect-info-delay')
      })

      it('should display by email collect delay when delay is specified and email is normally received', () => {
        const booking = {
          ...initialBooking,
          confirmationDate: formatISO(new Date()).slice(0, -1),
          stock: {
            ...initialBooking.stock,
            beginningDatetime: formatISO(addDays(new Date(), 2)).slice(0, -1),
            offer: {
              ...initialBooking.stock.offer,
              withdrawalType: OFFER_WITHDRAWAL_TYPE_OPTIONS.BY_EMAIL,
              withdrawalDelay: 60 * 60 * 24 * 2,
            },
          },
        }

        const { getByTestId } = render(
          <BookingDetailsTicketContent booking={booking} proDisableEventsQrcode={true} />
        )
        getByTestId('collect-info-email')
      })

      it('should not display by email collect delay when delay is not specified and email is not received yet', () => {
        const booking = {
          ...initialBooking,
          confirmationDate: formatISO(new Date()).slice(0, -1),
          stock: {
            ...initialBooking.stock,
            beginningDatetime: formatISO(addDays(new Date(), 3)).slice(0, -1),
            offer: {
              ...initialBooking.stock.offer,
              withdrawalType: OFFER_WITHDRAWAL_TYPE_OPTIONS.BY_EMAIL,
              withdrawalDelay: 0,
            },
          },
        }

        const { queryByTestId } = render(
          <BookingDetailsTicketContent booking={booking} proDisableEventsQrcode={true} />
        )
        expect(queryByTestId('collect-info-delay')).toBeFalsy()
      })

      it('should display information like what the event is today', () => {
        const booking = {
          ...initialBooking,
          confirmationDate: formatISO(addDays(new Date(), -2)).slice(0, -1),
          stock: {
            ...initialBooking.stock,
            beginningDatetime: formatISO(new Date()).slice(0, -1),
            offer: {
              ...initialBooking.stock.offer,
              withdrawalType: OFFER_WITHDRAWAL_TYPE_OPTIONS.BY_EMAIL,
              withdrawalDelay: 0,
            },
          },
        }

        const { queryByTestId } = render(
          <BookingDetailsTicketContent booking={booking} proDisableEventsQrcode={true} />
        )

        expect(queryByTestId('collect-info-email-msg')?.children[0]).toContain(`aujourd'hui`)
      })
    })
  })
})
