import { addDays, formatISO } from 'date-fns'
import React from 'react'

import {
  BookingDetailsTicketContent,
  formatCollectDelayString,
} from 'features/bookings/components/BookingDetailsTicketContent'
import { OFFER_WITHDRAWAL_TYPE_OPTIONS } from 'features/bookings/components/types'
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

    it('should not display on site collect wording if type collect is not on site', () => {
      const booking = bookingsSnap.ongoing_bookings[0]
      booking.stock.offer.isDigital = false
      const { queryByTestId } = render(
        <BookingDetailsTicketContent booking={booking} proDisableEventsQrcode={true} />
      )

      expect(queryByTestId('collect-info')).toBeFalsy()
    })

    describe('should display collect wording', () => {
      const initialBooking = bookingsSnap.ongoing_bookings[0]

      it('On site with delay', () => {
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

      it('On site without delay', () => {
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

      it('By email with delay and email not received yet', () => {
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

      it('By email with delay and email normally received', () => {
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

      it('By email without delay and email not received yet', () => {
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

      it('By email, email normally received and same day event', () => {
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

        const { getByTestId } = render(
          <BookingDetailsTicketContent booking={booking} proDisableEventsQrcode={true} />
        )
        getByTestId('collect-info-email')
      })
    })

    describe('formatCollectDelayString', () => {
      describe('should display collect wording', () => {
        it('In minutes', () => {
          const message = formatCollectDelayString(1800)
          expect(message).toEqual('30 minutes')
        })

        it('In hour', () => {
          const message = formatCollectDelayString(3600)
          expect(message).toEqual('1 heure')
        })

        it('In hours', () => {
          const message = formatCollectDelayString(7200)
          expect(message).toEqual('2 heures')
        })

        it('In days', () => {
          const message = formatCollectDelayString(518400)
          expect(message).toEqual('6 jours')
        })

        it('In week', () => {
          const message = formatCollectDelayString(604800)
          expect(message).toEqual('1 semaine')
        })
      })
    })
  })
})
