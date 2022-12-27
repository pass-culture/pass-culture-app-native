import { addDays, formatISO } from 'date-fns'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { SubcategoryIdEnum, WithdrawalTypeEnum } from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { Booking } from 'features/bookings/types'
import { fireEvent, render } from 'tests/utils'

import { OnGoingBookingItem } from './OnGoingBookingItem'

describe('OnGoingBookingItem', () => {
  const initialBooking: Booking = bookingsSnap.ongoing_bookings[0]

  it('should navigate to the booking details page', () => {
    const { getByTestId } = renderOnGoingBookingItem(initialBooking)

    const item = getByTestId('OnGoingBookingItem')
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
      const { getByTestId } = renderOnGoingBookingItem(booking)

      expect(getByTestId('on-site-withdrawal-container')).toBeTruthy()
    })

    it('should not display event reminder', () => {
      const { queryByTestId } = renderOnGoingBookingItem(booking)
      expect(queryByTestId('withdraw-container')).toBeNull()
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
      const { queryByTestId } = renderOnGoingBookingItem(booking)
      expect(queryByTestId('on-site-withdrawal-container')).toBeNull()
    })

    it('should display event reminder', () => {
      const { getByTestId } = renderOnGoingBookingItem(booking)
      expect(getByTestId('withdraw-container')).toBeTruthy()
    })
  })
})

function renderOnGoingBookingItem(booking: Booking) {
  return render(<OnGoingBookingItem booking={booking} />)
}
