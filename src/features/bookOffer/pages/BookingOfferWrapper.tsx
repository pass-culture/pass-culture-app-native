import React, { useContext, useMemo, useReducer } from 'react'

import {
  Action,
  initialBookingState,
  bookOfferReducer,
  BookingState,
} from 'features/bookOffer/pages/reducer'
import { useOffer } from 'features/offer/api/useOffer'

interface IBookingContext {
  bookingState: BookingState
  dismissModal: () => void
  dispatch: React.Dispatch<Action>
}

const BookingContext = React.createContext<IBookingContext>({
  bookingState: initialBookingState,
  dispatch: () => null,
  dismissModal: () => null,
})

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

export const useBooking = (): IBookingContext => {
  return useContext(BookingContext)
}

export const useBookingOffer = () => {
  const { bookingState } = useBooking()
  const { data: offer } = useOffer({ offerId: bookingState.offerId as number })
  return offer
}

export const useBookingStock = () => {
  const { bookingState } = useBooking()
  const offer = useBookingOffer()
  return offer ? offer.stocks.find(({ id }) => id === bookingState.stockId) : undefined
}
