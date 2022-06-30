import React from 'react'

import { SubcategoryIdEnum } from 'api/gen'
import { BookingDetailsTicketContent } from 'features/bookings/components/BookingDetailsTicketContent'
import { render } from 'tests/utils'

import { bookingsSnap } from '../api/bookingsSnap'

describe('BookingDetailsTicketContent', () => {
  const originalBooking = bookingsSnap.ongoing_bookings[0]
  const booking = {
    ...originalBooking,
    activationCode: { code: 'someCode' },
    stock: {
      ...originalBooking.stock,
      offer: {
        ...originalBooking.stock.offer,
        url: 'https://example.com',
      },
    },
  }

  describe('activationCodeFeatureEnabled === true & token', () => {
    it('should display the booking activation code when activationCodeFeatureEnabled is true', () => {
      const { getByText, queryByText } = render(
        <BookingDetailsTicketContent booking={booking} activationCodeFeatureEnabled={true} />
      )

      getByText(booking.activationCode.code)
      // @ts-expect-error: type comes from bookingsSnap it's necessarily a string
      expect(queryByText(booking.token)).toBeFalsy()
    })

    it('should display the access button offer when activationCodeFeatureEnabled is true', () => {
      const { queryByText } = render(
        <BookingDetailsTicketContent booking={booking} activationCodeFeatureEnabled={true} />
      )
      expect(queryByText("Accéder à l'offre")).toBeTruthy()
    })
  })

  describe('activationCodeFeatureEnabled === false & token', () => {
    it('should display the booking token when activationCodeFeatureEnabled is false', () => {
      const { getByText, queryByText } = render(
        <BookingDetailsTicketContent booking={booking} activationCodeFeatureEnabled={false} />
      )
      // @ts-expect-error: type comes from bookingsSnap it's necessarily a string
      getByText(booking.token)
      expect(queryByText(booking.activationCode.code)).toBeFalsy()
    })

    it('should display the access button offer when activationCodeFeatureEnabled is true', () => {
      const { queryByText } = render(
        <BookingDetailsTicketContent booking={booking} activationCodeFeatureEnabled={false} />
      )
      expect(queryByText("Accéder à l'offre")).toBeTruthy()
    })

    it('should not display the access button offer when offer is not digital', () => {
      booking.stock.offer.isDigital = false
      const { queryByText } = render(
        <BookingDetailsTicketContent booking={booking} activationCodeFeatureEnabled={false} />
      )
      expect(queryByText("Accéder à l'offre")).toBeFalsy()
    })
  })

  describe('EAN', () => {
    it('should display EAN when the offer is a book with an isbn', () => {
      const bookingForBookOffer = {
        ...booking,
        stock: {
          ...booking.stock,
          offer: {
            ...booking.stock.offer,
            subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
          },
        },
      }
      const { queryByTestId } = render(
        <BookingDetailsTicketContent
          booking={bookingForBookOffer}
          activationCodeFeatureEnabled={true}
        />
      )
      expect(queryByTestId('ean')).toBeTruthy()
    })

    it('should not display EAN when the offer is a book without an isbn', () => {
      const bookingWithIsbn = {
        ...booking,
        stock: {
          ...booking.stock,
          offer: {
            ...booking.stock.offer,
            extraData: { isbn: null },
            subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
          },
        },
      }
      const { queryByTestId } = render(
        <BookingDetailsTicketContent
          booking={bookingWithIsbn}
          activationCodeFeatureEnabled={true}
        />
      )
      expect(queryByTestId('ean')).toBeFalsy()
    })

    it('should not display EAN when the offer is not a book', () => {
      const bookingWithIsbn = {
        ...booking,
        stock: {
          ...booking.stock,
          offer: {
            ...booking.stock.offer,
            subcategoryId: SubcategoryIdEnum.FESTIVAL_CINE,
          },
        },
      }
      const { queryByTestId } = render(
        <BookingDetailsTicketContent
          booking={bookingWithIsbn}
          activationCodeFeatureEnabled={true}
        />
      )
      expect(queryByTestId('ean')).toBeFalsy()
    })
  })
})
