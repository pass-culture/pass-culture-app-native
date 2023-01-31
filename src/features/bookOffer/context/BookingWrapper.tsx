import React, { useMemo, useReducer } from 'react'

import { initialBookingState, bookOfferReducer } from 'features/bookOffer/context/reducer'
import { BookingContext } from 'features/bookOffer/pages/BookingContext'

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
