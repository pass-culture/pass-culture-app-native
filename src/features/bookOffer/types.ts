import React from 'react'

import { Action, BookingState } from 'features/bookOffer/pages/reducer'

export interface IBookingContext {
  bookingState: BookingState
  dismissModal: () => void
  dispatch: React.Dispatch<Action>
}
