import { addDays, formatISO } from 'date-fns'
import React from 'react'

import { SubcategoryIdEnum, WithdrawalTypeEnum } from 'api/gen'
import { BookingDetailsTicketContent } from 'features/bookings/components/BookingDetailsTicketContent'
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

  describe('QR code display', () => {
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

    it('should display the QR code when event subcategory is not in notQrCodeSubcategories', () => {
      const { getByTestId } = render(<BookingDetailsTicketContent booking={initialBooking} />)
      getByTestId('qr-code')
    })

    it('should not display the QR code when event subcategory is in notQrCodeSubcategories', () => {
      const booking = {
        ...initialBooking,
        stock: {
          ...initialBooking.stock,
          offer: {
            ...initialBooking.stock.offer,
            subcategoryId: SubcategoryIdEnum.FESTIVAL_MUSIQUE,
          },
        },
      }

      const { queryByTestId } = render(<BookingDetailsTicketContent booking={booking} />)

      expect(queryByTestId('qr-code')).toBeFalsy()
    })

    it('should not display on site withdrawal wording if withdrawal type is not on site', () => {
      const { queryByTestId } = render(<BookingDetailsTicketContent booking={initialBooking} />)

      expect(queryByTestId('withdrawal-info')).toBeFalsy()
    })

    describe('should display withdrawal wording', () => {
      it('should display on site withdrawal delay when delay is specified', () => {
        const booking = {
          ...initialBooking,
          stock: {
            ...initialBooking.stock,
            offer: {
              ...initialBooking.stock.offer,
              subcategoryId: SubcategoryIdEnum.FESTIVAL_MUSIQUE,
              withdrawalType: WithdrawalTypeEnum.on_site,
              withdrawalDelay: 60 * 60 * 2,
            },
          },
        }

        const { getByTestId } = render(<BookingDetailsTicketContent booking={booking} />)
        getByTestId('withdrawal-info-delay')
      })

      it('should not display on site withdrawal delay when delay is not specified', () => {
        const booking = {
          ...initialBooking,
          stock: {
            ...initialBooking.stock,
            offer: {
              ...initialBooking.stock.offer,
              subcategoryId: SubcategoryIdEnum.FESTIVAL_MUSIQUE,
              withdrawalType: WithdrawalTypeEnum.on_site,
              withdrawalDelay: 0,
            },
          },
        }
        const { queryByTestId } = render(<BookingDetailsTicketContent booking={booking} />)
        expect(queryByTestId('withdrawal-info-delay')).toBeFalsy()
      })

      it('should display by email withdrawal delay when delay is specified and email is not received yet', () => {
        const booking = {
          ...initialBooking,
          confirmationDate: formatISO(new Date()).slice(0, -1),
          stock: {
            ...initialBooking.stock,
            beginningDatetime: formatISO(addDays(new Date(), 3)).slice(0, -1),
            offer: {
              ...initialBooking.stock.offer,
              subcategoryId: SubcategoryIdEnum.FESTIVAL_MUSIQUE,
              withdrawalType: WithdrawalTypeEnum.by_email,
              withdrawalDelay: 60 * 60 * 24 * 2,
            },
          },
        }
        const { getByTestId } = render(<BookingDetailsTicketContent booking={booking} />)
        getByTestId('withdrawal-info-delay')
      })

      it('should display by email withdrawal delay when delay is specified and email is normally received', () => {
        const booking = {
          ...initialBooking,
          confirmationDate: formatISO(new Date()).slice(0, -1),
          stock: {
            ...initialBooking.stock,
            beginningDatetime: formatISO(addDays(new Date(), 2)).slice(0, -1),
            offer: {
              ...initialBooking.stock.offer,
              subcategoryId: SubcategoryIdEnum.FESTIVAL_MUSIQUE,
              withdrawalType: WithdrawalTypeEnum.by_email,
              withdrawalDelay: 60 * 60 * 24 * 2,
            },
          },
        }

        const { getByTestId } = render(<BookingDetailsTicketContent booking={booking} />)
        getByTestId('withdrawal-info-email')
      })

      it('should not display by email withdrawal delay when delay is not specified and email is not received yet', () => {
        const booking = {
          ...initialBooking,
          confirmationDate: formatISO(new Date()).slice(0, -1),
          stock: {
            ...initialBooking.stock,
            beginningDatetime: formatISO(addDays(new Date(), 3)).slice(0, -1),
            offer: {
              ...initialBooking.stock.offer,
              subcategoryId: SubcategoryIdEnum.FESTIVAL_MUSIQUE,
              withdrawalType: WithdrawalTypeEnum.by_email,
              withdrawalDelay: 0,
            },
          },
        }

        const { queryByTestId } = render(<BookingDetailsTicketContent booking={booking} />)
        expect(queryByTestId('withdrawal-info-delay')).toBeFalsy()
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
              subcategoryId: SubcategoryIdEnum.FESTIVAL_MUSIQUE,
              withdrawalType: WithdrawalTypeEnum.by_email,
              withdrawalDelay: 0,
            },
          },
        }

        const { queryByTestId } = render(<BookingDetailsTicketContent booking={booking} />)

        expect(queryByTestId('withdrawal-info-email-msg')?.children[0]).toContain(`aujourd'hui`)
      })

      it('should display no ticket withdrawal wording and circled check icon', () => {
        const booking = {
          ...initialBooking,
          stock: {
            ...initialBooking.stock,
            offer: {
              ...initialBooking.stock.offer,
              subcategoryId: SubcategoryIdEnum.FESTIVAL_MUSIQUE,
              withdrawalType: WithdrawalTypeEnum.no_ticket,
              withdrawalDelay: 0,
            },
          },
        }

        const { getByTestId } = render(<BookingDetailsTicketContent booking={booking} />)
        getByTestId('withdrawal-info-no-ticket')
      })
    })
  })
})
