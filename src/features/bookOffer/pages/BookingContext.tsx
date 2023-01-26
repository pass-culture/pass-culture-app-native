import React from 'react'

import { IBookingContext } from 'features/bookOffer/pages/BookingOfferWrapper'
import { initialBookingState } from 'features/bookOffer/pages/reducer'

export const BookingContext = React.createContext<IBookingContext>({
  bookingState: initialBookingState,
  dispatch: () => null,
  dismissModal: () => null,
})
