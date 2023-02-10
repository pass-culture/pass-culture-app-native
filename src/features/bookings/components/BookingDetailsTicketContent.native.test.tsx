import React from 'react'

import { SubcategoryIdEnum } from 'api/gen'
import { BookingDetailsTicketContent } from 'features/bookings/components/BookingDetailsTicketContent'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { render } from 'tests/utils'

describe('BookingDetailsTicketContent', () => {
  const originalBooking = bookingsSnap.ongoing_bookings[0]
  const booking = {
    ...originalBooking,
    activationCode: { code: 'someCode' },
    completedUrl: 'https://example.com',
    stock: {
      ...originalBooking.stock,
      offer: {
        ...originalBooking.stock.offer,
      },
    },
  }

  it('should display the booking activation code when booking has one', () => {
    const { getByText } = render(<BookingDetailsTicketContent booking={booking} />)

    expect(getByText(booking.activationCode.code)).toBeTruthy()
  })

  it('should not display the booking token when booking has activation code', () => {
    const { queryByText } = render(<BookingDetailsTicketContent booking={booking} />)

    // @ts-expect-error: type comes from bookingsSnap it's necessarily a string
    expect(queryByText(booking.token)).toBeNull()
  })

  it('should display the booking token when booking has no activation code', () => {
    const { getByText } = render(<BookingDetailsTicketContent booking={originalBooking} />)

    // @ts-expect-error: type comes from bookingsSnap it's necessarily a string
    expect(getByText(booking.token)).toBeTruthy()
  })

  it('should display the access button offer when booking has activation code', () => {
    const { getByText } = render(<BookingDetailsTicketContent booking={booking} />)

    expect(getByText('Accéder à l’offre')).toBeTruthy()
  })

  it('should not display the access button offer when offer is not digital and booking has no activation code', () => {
    const booking = {
      ...originalBooking,
      completedUrl: 'https://example.com',
      stock: {
        ...originalBooking.stock,
        offer: {
          ...originalBooking.stock.offer,
          isDigital: false,
        },
      },
    }
    const { queryByText } = render(<BookingDetailsTicketContent booking={booking} />)
    expect(queryByText('Accéder à l’offre')).toBeNull()
  })

  it('should display the access button offer when offer is digital and booking has no activation code', () => {
    const booking = {
      ...originalBooking,
      completedUrl: 'https://example.com',
      stock: {
        ...originalBooking.stock,
        offer: {
          ...originalBooking.stock.offer,
          isDigital: true,
        },
      },
    }
    const { getByText } = render(<BookingDetailsTicketContent booking={booking} />)
    expect(getByText('Accéder à l’offre')).toBeTruthy()
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
        <BookingDetailsTicketContent booking={bookingForBookOffer} />
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
      const { queryByTestId } = render(<BookingDetailsTicketContent booking={bookingWithIsbn} />)
      expect(queryByTestId('ean')).toBeNull()
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
      const { queryByTestId } = render(<BookingDetailsTicketContent booking={bookingWithIsbn} />)
      expect(queryByTestId('ean')).toBeNull()
    })
  })
})
