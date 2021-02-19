import React, { useContext, useReducer } from 'react'

import {
  Action,
  initialBookingState,
  searchReducer,
  BookingState,
} from 'features/bookOffer/pages/reducer'

export interface IBookingContext {
  bookingState: BookingState
  dispatch: React.Dispatch<Action>
}

export const BookingContext = React.createContext<IBookingContext | null>(null)

export const BookingWrapper = ({ children }: { children: Element }) => {
  const [bookingState, dispatch] = useReducer(searchReducer, initialBookingState)

  return (
    <BookingContext.Provider value={{ bookingState, dispatch }}>{children}</BookingContext.Provider>
  )
}

export const useBooking = (): Pick<IBookingContext, 'bookingState' | 'dispatch'> => {
  // The bookingState is initialized so this can't be null
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { bookingState, dispatch } = useContext(BookingContext)!
  return { bookingState, dispatch }
}
