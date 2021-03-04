import React, { useContext, useReducer } from 'react'

import {
  Action,
  initialBookingState,
  bookOfferReducer,
  BookingState,
} from 'features/bookOffer/pages/reducer'
import { useOffer } from 'features/offer/api/useOffer'

export interface IBookingContext {
  bookingState: BookingState
  dispatch: React.Dispatch<Action>
}

export const BookingContext = React.createContext<IBookingContext | null>(null)

export const BookingWrapper = ({ children }: { children: Element }) => {
  const [bookingState, dispatch] = useReducer(bookOfferReducer, initialBookingState)

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

export const useBookingOffer = () => {
  const { bookingState } = useBooking()
  const { data: offer } = useOffer({ offerId: bookingState.offerId || 0 })
  return offer
}

export const useBookingStock = () => {
  const { bookingState } = useBooking()
  const offer = useBookingOffer()
  return offer ? offer.stocks.find(({ id }) => id === bookingState.stockId) : undefined
}
