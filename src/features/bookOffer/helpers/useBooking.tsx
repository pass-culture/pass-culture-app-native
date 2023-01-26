import { useContext } from 'react'

import { BookingContext } from '../pages/BookingContext'
import { IBookingContext } from '../pages/BookingOfferWrapper'

export const useBooking = (): IBookingContext => {
  return useContext(BookingContext)
}
