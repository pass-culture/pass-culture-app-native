import { addDays, formatISO } from 'date-fns'
import mockdate from 'mockdate'
import React from 'react'
import { Share } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import { BookingListItemResponse, SubcategoryIdEnum, WithdrawalTypeEnum } from 'api/gen'
import { FREE_OFFER_CATEGORIES_TO_ARCHIVE } from 'features/bookings/constants'
import { ongoingBookingsV2ListSnap } from 'features/bookings/fixtures/bookingsSnap'
import { analytics } from 'libs/analytics/provider'
import { userEvent, render, screen } from 'tests/utils'

import { OnGoingBookingItem } from './OnGoingBookingItem'

jest.mock('libs/subcategories/useCategoryId')
jest.mock('libs/subcategories/useSubcategory')

const mockNativeShare = jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction })

jest.mock('libs/firebase/analytics/analytics')

jest.useFakeTimers()

describe('OnGoingBookingItem', () => {
  const bookings = ongoingBookingsV2ListSnap.bookings

  const initialBooking = ongoingBookingsV2ListSnap.bookings[0]

  it('should navigate to the booking details page', async () => {
    renderOnGoingBookingItem(initialBooking)

    const item = await screen.findByTestId(/Réservation de l’offre/)
    await userEvent.press(item)

    expect(navigate).toHaveBeenCalledWith('BookingDetails', { id: initialBooking.id })
  })

  it('should log analytic logViewedBookingPage when click on CTA', async () => {
    renderOnGoingBookingItem(initialBooking)

    const item = await screen.findByTestId(/Réservation de l’offre/)
    await userEvent.press(item)

    expect(analytics.logViewedBookingPage).toHaveBeenCalledWith({
      offerId: initialBooking.stock.offer.id,
      from: 'bookings',
    })
  })

  describe('should be on site withdrawal ticket event', () => {
    const booking = {
      ...initialBooking,
      withdrawalType: WithdrawalTypeEnum.on_site,
    }

    beforeEach(() => mockdate.set(new Date(booking.stock.beginningDatetime as string)))

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
          withdrawalType: WithdrawalTypeEnum.no_ticket,
        },
      },
    }

    beforeEach(() => mockdate.set(new Date(booking.stock.beginningDatetime)))

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
        totalAmount: 0,
        dateCreated: new Date('2021-02-15T00:00:00Z').toDateString(),
        expirationDate: null,
        stock: {
          ...initialBooking.stock,
          offer: {
            ...initialBooking.stock.offer,
            subcategoryId: SubcategoryIdEnum.ABO_BIBLIOTHEQUE,
          },
        },
      }
      renderOnGoingBookingItem(booking, bookings)

      expect(screen.getByText('Ta réservation s’archivera dans 25 jours')).toBeOnTheScreen()
    })

    it.each(FREE_OFFER_CATEGORIES_TO_ARCHIVE.map((category) => [category, 0]))(
      'should display expiration message : "Ta réservation s\'archivera dans XX jours" when price is 0 and subcategory %s',
      (subcategoryId) => {
        mockdate.set(new Date('2021-02-20T00:00:00Z'))
        const booking = {
          ...initialBooking,
          dateCreated: new Date('2021-02-15T00:00:00Z').toDateString(),
          stock: {
            ...initialBooking.stock,
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
        dateCreated: new Date('2021-02-15T00:00:00Z').toDateString(),
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
    renderOnGoingBookingItem(initialBooking, bookings)

    const shareButton = await screen.findByLabelText(
      `Partager l’offre ${initialBooking.stock.offer.name}`
    )
    await userEvent.press(shareButton)

    expect(mockNativeShare).toHaveBeenCalledTimes(1)
  })

  it('should log analytics when press share icon', async () => {
    renderOnGoingBookingItem(initialBooking, bookings)

    const shareButton = await screen.findByLabelText(
      `Partager l’offre ${initialBooking.stock.offer.name}`
    )
    await userEvent.press(shareButton)

    expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
      type: 'Offer',
      from: 'bookings',
      offerId: initialBooking.stock.offer.id,
    })
  })
})

const renderOnGoingBookingItem = (
  booking: BookingListItemResponse,
  eligibleBookingsForArchive: BookingListItemResponse[] = []
) => {
  return render(
    <OnGoingBookingItem booking={booking} eligibleBookingsForArchive={eligibleBookingsForArchive} />
  )
}
