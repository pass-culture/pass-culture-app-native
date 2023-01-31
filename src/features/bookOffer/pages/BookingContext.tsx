import React from 'react'

import { initialBookingState } from 'features/bookOffer/context/reducer'
import { IBookingContext } from 'features/bookOffer/types'

export const BookingContext = React.createContext<IBookingContext>({
  bookingState: initialBookingState,
  dispatch: () => null,
  dismissModal: () => null,
})
