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
  dismissModal: () => void
  dispatch: React.Dispatch<Action>
}

export const BookingContext = React.createContext<IBookingContext | null>(null)

interface BookingWrapperProps {
  children: Element
  dismissModal: () => void
}

export const BookingWrapper = ({ children, dismissModal }: BookingWrapperProps) => {
  const [bookingState, dispatch] = useReducer(bookOfferReducer, initialBookingState)

  return (
    <BookingContext.Provider value={{ bookingState, dispatch, dismissModal }}>
      {children}
    </BookingContext.Provider>
  )
}

export const useBooking = (): IBookingContext => {
  const bookingContext = useContext(BookingContext)
  return (
    bookingContext ?? {
      bookingState: initialBookingState,
      dispatch: () => null,
      dismissModal: () => null,
    }
  )
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
