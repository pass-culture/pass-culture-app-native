import React from 'react'

import { BookingReponse, CategoryIdEnum, SubcategoryIdEnum } from 'api/gen'
import { BookingDetailsTicketContent } from 'features/bookings/components/OldBookingDetails/BookingDetailsTicketContent'
import { QrCodeWithSeatProps } from 'features/bookings/components/OldBookingDetails/TicketBody/QrCodeWithSeat/QrCodeWithSeat'
import { bookingsSnap } from 'features/bookings/fixtures/index'
import * as useCategoryIdModule from 'libs/subcategories/useCategoryId'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const useCategoryIdSpy = jest.spyOn(useCategoryIdModule, 'useCategoryId')

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
    renderBookingDetailsTicketContent(booking)

    expect(screen.getByText(booking.activationCode.code)).toBeOnTheScreen()
  })

  it('should not display the booking token when booking has activation code', () => {
    renderBookingDetailsTicketContent(booking)

    const { token } = booking

    expect(screen.queryByText(token)).not.toBeOnTheScreen()
  })

  it('should display the booking token when booking has no activation code', () => {
    renderBookingDetailsTicketContent(originalBooking)

    const { token } = booking

    expect(screen.getByText(token)).toBeOnTheScreen()
  })

  it('should display the access button offer when booking has activation code', () => {
    renderBookingDetailsTicketContent(booking)

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
    renderBookingDetailsTicketContent(booking)

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
    renderBookingDetailsTicketContent(booking)

    expect(screen.getByText('Accéder à l’offre en ligne')).toBeOnTheScreen()
  })

  describe('EAN', () => {
    it('should display EAN when the offer is a book with an EAN', () => {
      useCategoryIdSpy.mockReturnValueOnce(CategoryIdEnum.LIVRE)

      const bookingWithEAN = {
        ...booking,
        stock: {
          ...booking.stock,
          offer: {
            ...booking.stock.offer,
            subcategoryId: SubcategoryIdEnum.LIVRE_PAPIER,
          },
        },
      }

      renderBookingDetailsTicketContent(bookingWithEAN)

      expect(screen.getByText(bookingWithEAN.stock.offer.extraData.ean)).toBeOnTheScreen()
    })

    it('should not display EAN when the offer is a book without an EAN', () => {
      useCategoryIdSpy.mockReturnValueOnce(CategoryIdEnum.LIVRE)

      const bookingWithoutEAN = {
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

      renderBookingDetailsTicketContent(bookingWithoutEAN)

      expect(screen.queryByTestId('bookingComplementaryInfo')).not.toBeOnTheScreen()
    })

    it('should not display EAN when the offer is not a book', () => {
      useCategoryIdSpy.mockReturnValueOnce(CategoryIdEnum.MUSIQUE_LIVE)

      const bookingWithEAN = {
        ...booking,
        stock: {
          ...booking.stock,
          offer: {
            ...booking.stock.offer,
            subcategoryId: SubcategoryIdEnum.FESTIVAL_CINE,
          },
        },
      }

      renderBookingDetailsTicketContent(bookingWithEAN)

      expect(screen.queryByText(bookingWithEAN.stock.offer.extraData.ean)).not.toBeOnTheScreen()
    })
  })

  describe('BarCode', () => {
    const externalBookings = { barcode: '123456' }

    it('should display BarCode when the offer is an external booking with barCode and category is MUSIC_LIVE', () => {
      useCategoryIdSpy.mockReturnValueOnce(CategoryIdEnum.MUSIQUE_LIVE)

      renderBookingDetailsTicketContent(booking, externalBookings)

      expect(screen.getByText(externalBookings.barcode)).toBeOnTheScreen()
    })

    it('should not display barCode when the booking is not an external one', () => {
      useCategoryIdSpy.mockReturnValueOnce(CategoryIdEnum.MUSIQUE_LIVE)

      renderBookingDetailsTicketContent(booking)

      expect(screen.queryByText(externalBookings.barcode)).not.toBeOnTheScreen()
    })

    it('should not display barCode when category is not MUSIC_LIVE', () => {
      useCategoryIdSpy.mockReturnValueOnce(CategoryIdEnum.LIVRE)

      renderBookingDetailsTicketContent(booking)

      expect(screen.queryByText(externalBookings.barcode)).not.toBeOnTheScreen()
    })
  })
})

const renderBookingDetailsTicketContent = (
  booking: BookingReponse,
  externalBookings?: QrCodeWithSeatProps
) =>
  render(
    reactQueryProviderHOC(
      <BookingDetailsTicketContent booking={booking} externalBookings={externalBookings} />
    )
  )
