import React, { useMemo, useReducer } from 'react'

import { BookingContext } from 'features/bookOffer/pages/BookingContext'
import { initialBookingState, bookOfferReducer } from 'features/bookOffer/pages/reducer'

interface BookingWrapperProps {
  children: JSX.Element
  dismissModal: () => void
}

export const BookingWrapper = ({ children, dismissModal }: BookingWrapperProps) => {
  const [bookingState, dispatch] = useReducer(bookOfferReducer, initialBookingState)

  const value = useMemo(
    () => ({ bookingState, dispatch, dismissModal }),
    [bookingState, dismissModal]
  )
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}
