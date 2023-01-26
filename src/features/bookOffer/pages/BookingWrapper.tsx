import React, { useMemo, useReducer } from 'react'

import { BookingContext } from 'features/bookOffer/pages/BookingContext'
import { BookingWrapperProps } from 'features/bookOffer/pages/BookingOfferWrapper'
import { initialBookingState, bookOfferReducer } from 'features/bookOffer/pages/reducer'

export const BookingWrapper = ({ children, dismissModal }: BookingWrapperProps) => {
  const [bookingState, dispatch] = useReducer(bookOfferReducer, initialBookingState)

  const value = useMemo(
    () => ({ bookingState, dispatch, dismissModal }),
    [bookingState, dismissModal]
  )
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}
