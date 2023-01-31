import React from 'react'

import { Action, BookingState } from 'features/bookOffer/context/reducer'

export interface IBookingContext {
  bookingState: BookingState
  dismissModal: () => void
  dispatch: React.Dispatch<Action>
}
