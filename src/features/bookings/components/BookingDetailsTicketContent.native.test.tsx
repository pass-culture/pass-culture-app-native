import React from 'react'

import { SubcategoryIdEnum } from 'api/gen'
import { BookingDetailsTicketContent } from 'features/bookings/components/BookingDetailsTicketContent'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { render, screen } from 'tests/utils'

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
    render(<BookingDetailsTicketContent booking={booking} />)

    expect(screen.getByText(booking.activationCode.code)).toBeOnTheScreen()
  })

  it('should not display the booking token when booking has activation code', () => {
    render(<BookingDetailsTicketContent booking={booking} />)

    const token = booking.token as string
    expect(screen.queryByText(token)).not.toBeOnTheScreen()
  })

  it('should display the booking token when booking has no activation code', () => {
    render(<BookingDetailsTicketContent booking={originalBooking} />)

    const token = booking.token as string
    expect(screen.getByText(token)).toBeOnTheScreen()
  })

  it('should display the access button offer when booking has activation code', () => {
    render(<BookingDetailsTicketContent booking={booking} />)

    expect(screen.getByText('Accéder à l’offre en ligne')).toBeOnTheScreen()
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
    render(<BookingDetailsTicketContent booking={booking} />)
    expect(screen.queryByText('Accéder à l’offre en ligne')).not.toBeOnTheScreen()
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
    render(<BookingDetailsTicketContent booking={booking} />)
    expect(screen.getByText('Accéder à l’offre en ligne')).toBeOnTheScreen()
  })

  describe('EAN', () => {
    it('should display EAN when the offer is a book with an EAN', () => {
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
      render(<BookingDetailsTicketContent booking={bookingForBookOffer} />)
      expect(screen.queryByTestId('ean')).toBeOnTheScreen()
    })

    it('should not display EAN when the offer is a book without an EAN', () => {
      const bookingWithEan = {
        ...booking,
        stock: {
          ...booking.stock,
          offer: {
            ...booking.stock.offer,
            extraData: { ean: null },
            subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
          },
        },
      }
      render(<BookingDetailsTicketContent booking={bookingWithEan} />)
      expect(screen.queryByTestId('ean')).not.toBeOnTheScreen()
    })

    it('should not display EAN when the offer is not a book', () => {
      const bookingWithEan = {
        ...booking,
        stock: {
          ...booking.stock,
          offer: {
            ...booking.stock.offer,
            subcategoryId: SubcategoryIdEnum.FESTIVAL_CINE,
          },
        },
      }
      render(<BookingDetailsTicketContent booking={bookingWithEan} />)
      expect(screen.queryByTestId('ean')).not.toBeOnTheScreen()
    })
  })
})
