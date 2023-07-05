import React, { useContext, useMemo, useReducer } from 'react'

import { BookingReducer, initialBookingState } from 'features/bookings/pages/BookingDetails/context/reducer'
import { BookingState ,Action} from 'features/bookings/pages/BookingDetails/context/types'

interface IBookingContext extends BookingState {
  dispatch: React.Dispatch<Action>
}

const BookingContext = React.createContext<IBookingContext | null>(null)

export const BookingContextProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[]
}) => {
  const [BookingState, dispatch] = useReducer(BookingReducer, initialBookingState)

  const value = useMemo(() => ({ ...BookingState, dispatch }), [BookingState, dispatch])
  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
}

export const useBookingDetailsContext = (): IBookingContext => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return useContext(BookingContext)!
}
