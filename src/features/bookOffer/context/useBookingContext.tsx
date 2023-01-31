import { useContext } from 'react'

import { BookingContext } from 'features/bookOffer/pages/BookingContext'
import { IBookingContext } from 'features/bookOffer/types'

export const useBookingContext = (): IBookingContext => {
  return useContext(BookingContext)
}
