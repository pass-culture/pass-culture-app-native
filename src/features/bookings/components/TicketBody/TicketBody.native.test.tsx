import { addDays, formatISO } from 'date-fns'
import React from 'react'

import { SubcategoryIdEnum, WithdrawalTypeEnum } from 'api/gen'
import { bookingsSnap } from 'features/bookings/api/bookingsSnap'
import { TicketBody } from 'features/bookings/components/TicketBody/TicketBody'
import { render } from 'tests/utils'

describe('TicketBody', () => {
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

  describe('<QrCode/> display', () => {
    it('should display the QR code when event subcategory is not in subcategories list without QR code display', () => {
      const { queryByTestId } = render(<TicketBody booking={initialBooking} />)
      expect(queryByTestId('qr-code')).toBeTruthy()
    })

    it('should not display the QR code when event subcategory is in subcategories list without QR code display', () => {
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

      const { queryByTestId } = render(<TicketBody booking={booking} />)

      expect(queryByTestId('qr-code')).toBeFalsy()
    })
  })

  describe('Withdrawal', () => {
    it('should not display on site withdrawal if withdrawal type is null', () => {
      const booking = {
        ...initialBooking,
        stock: {
          ...initialBooking.stock,
          offer: {
            ...initialBooking.stock.offer,
            withdrawalType: null,
          },
        },
      }
      const { queryByTestId } = render(<TicketBody booking={booking} />)

      expect(queryByTestId('withdrawal-info')).toBeFalsy()
    })

    describe('<NoTicket/> display', () => {
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

        const { queryByTestId } = render(<TicketBody booking={booking} />)

        expect(queryByTestId('withdrawal-info-no-ticket')).toBeTruthy()
      })
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

      const { queryByTestId } = render(<TicketBody booking={booking} />)

      expect(queryByTestId('withdrawal-info-email')).toBeTruthy()
    })

    describe('<DefaultBody/> display', () => {
      it('should display on site withdrawal delay when delay is specified', () => {
        const booking = {
          ...initialBooking,
          stock: {
            ...initialBooking.stock,
            offer: {
              ...initialBooking.stock.offer,
              subcategoryId: SubcategoryIdEnum.FESTIVAL_MUSIQUE,
              withdrawalType: WithdrawalTypeEnum.on_site,
            },
          },
        }

        const { queryByTestId } = render(<TicketBody booking={booking} />)

        expect(queryByTestId('withdrawal-info')).toBeTruthy()
      })
    })
  })
})
