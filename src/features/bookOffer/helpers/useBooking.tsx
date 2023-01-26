import { useContext } from 'react'

import { BookingContext } from 'features/bookOffer/pages/BookingContext'
import { IBookingContext } from 'features/bookOffer/types'

export const useBooking = (): IBookingContext => {
  return useContext(BookingContext)
}
