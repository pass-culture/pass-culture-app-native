import { addDays, formatISO } from 'date-fns'
import mockdate from 'mockdate'
import React from 'react'
import { Share } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { SubcategoryIdEnum, WithdrawalTypeEnum } from 'api/gen'
import { FREE_OFFER_CATEGORIES_TO_ARCHIVE } from 'features/bookings/constants'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { Booking } from 'features/bookings/types'
import { analytics } from 'libs/analytics'
import { fireEvent, render, screen } from 'tests/utils'

import { OnGoingBookingItem } from './OnGoingBookingItem'

describe('OnGoingBookingItem', () => {
  const bookings = bookingsSnap.ongoing_bookings
  const initialBooking: Booking = bookingsSnap.ongoing_bookings[0]

  it('should navigate to the booking details page', () => {
    renderOnGoingBookingItem(initialBooking)

    const item = screen.getByTestId(/Réservation de l’offre/)
    fireEvent.press(item)

    expect(navigate).toHaveBeenCalledWith('BookingDetails', { id: 123 })
  })

  describe('should be on site withdrawal ticket event', () => {
    const booking = {
      ...initialBooking,
      stock: {
        ...initialBooking.stock,
        beginningDatetime: formatISO(addDays(new Date(), 1)).slice(0, -1),
        offer: {
          ...initialBooking.stock.offer,
          subcategoryId: SubcategoryIdEnum.CONCERT,
          withdrawalType: WithdrawalTypeEnum.on_site,
        },
      },
    }

    it('should display withdrawal reminder', () => {
      renderOnGoingBookingItem(booking)

      expect(screen.getByTestId('on-site-withdrawal-container')).toBeOnTheScreen()
    })

    it('should not display event reminder', () => {
      renderOnGoingBookingItem(booking)

      expect(screen.queryByTestId('withdraw-container')).not.toBeOnTheScreen()
    })
  })

  describe('should not be on site withdrawal ticket event', () => {
    const booking = {
      ...initialBooking,
      stock: {
        ...initialBooking.stock,
        beginningDatetime: formatISO(addDays(new Date(), 1)).slice(0, -1),
        offer: {
          ...initialBooking.stock.offer,
          subcategoryId: SubcategoryIdEnum.CONCERT,
          withdrawalType: WithdrawalTypeEnum.no_ticket,
        },
      },
    }

    it('should not display withdrawal reminder', () => {
      renderOnGoingBookingItem(booking)

      expect(screen.queryByTestId('on-site-withdrawal-container')).not.toBeOnTheScreen()
    })

    it('should display event reminder', () => {
      renderOnGoingBookingItem(booking)

      expect(screen.getByTestId('withdraw-container')).toBeOnTheScreen()
    })
  })

  describe('should display expiration messages', () => {
    afterAll(() => {
      mockdate.set(new Date())
    })

    it('should display expiration message : "Ta réservation s\'archivera dans XX jours"', () => {
      mockdate.set(new Date('2021-02-20T00:00:00Z'))
      const booking = {
        ...initialBooking,
        expirationDate: null,
        stock: {
          ...initialBooking.stock,
          offer: {
            ...initialBooking.stock.offer,
            isDigital: true,
          },
        },
      }
      renderOnGoingBookingItem(booking, bookings)

      expect(screen.getByText('Ta réservation s’archivera dans 25 jours')).toBeOnTheScreen()
    })

    it.each(FREE_OFFER_CATEGORIES_TO_ARCHIVE.map((category) => [category, 0]))(
      'should display expiration message : "Ta réservation s\'archivera dans XX jours" when price is 0 and subcategory %s',
      (subcategoryId, price) => {
        mockdate.set(new Date('2021-02-20T00:00:00Z'))
        const booking = {
          ...initialBooking,
          stock: {
            ...initialBooking.stock,
            price,
            offer: {
              ...initialBooking.stock.offer,
              subcategoryId,
            },
          },
        }
        renderOnGoingBookingItem(booking, bookings)

        expect(screen.getByText('Ta réservation s’archivera dans 25 jours')).toBeOnTheScreen()
      }
    )

    it.each(FREE_OFFER_CATEGORIES_TO_ARCHIVE.map((category) => [category, 1000]))(
      'should not display expiration message : "Ta réservation s\'archivera dans XX jours" when price is not 0 and subcategory %s',
      (subcategoryId, price) => {
        mockdate.set(new Date('2021-02-20T00:00:00Z'))
        const booking = {
          ...initialBooking,
          stock: {
            ...initialBooking.stock,
            price,
            offer: {
              ...initialBooking.stock.offer,
              subcategoryId,
            },
          },
        }
        renderOnGoingBookingItem(booking)

        expect(screen.queryByText('Ta réservation s’archivera dans 25 jours')).not.toBeOnTheScreen()
      }
    )

    it('should display any expiration messages"', () => {
      mockdate.set(new Date('2021-03-18T00:00:00Z'))
      const booking = {
        ...initialBooking,
        expirationDate: null,
        stock: {
          ...initialBooking.stock,
          offer: {
            ...initialBooking.stock.offer,
            isDigital: false,
          },
        },
      }
      renderOnGoingBookingItem(booking, bookings)

      expect(screen.queryByTestId('expiration-booking-container')).not.toBeOnTheScreen()
    })
  })

  it('should call share when press share icon', async () => {
    const share = jest.spyOn(Share, 'share')
    renderOnGoingBookingItem(initialBooking, bookings)

    const shareButton = await screen.findByLabelText(
      `Partager l’offre ${initialBooking.stock.offer.name}`
    )
    fireEvent.press(shareButton)

    expect(share).toHaveBeenCalledTimes(1)
  })

  it('should log analytics when press share icon', async () => {
    renderOnGoingBookingItem(initialBooking, bookings)

    const shareButton = await screen.findByLabelText(
      `Partager l’offre ${initialBooking.stock.offer.name}`
    )
    fireEvent.press(shareButton)

    expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
      type: 'Offer',
      from: 'bookings',
      id: initialBooking.stock.offer.id,
    })
  })
})

function renderOnGoingBookingItem(booking: Booking, eligibleBookingsForArchive: Booking[] = []) {
  return render(
    <OnGoingBookingItem booking={booking} eligibleBookingsForArchive={eligibleBookingsForArchive} />
  )
}
