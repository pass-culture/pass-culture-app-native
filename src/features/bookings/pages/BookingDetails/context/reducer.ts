import { BookingState } from 'features/bookings/pages/BookingDetails/context/types'
import { Action } from 'features/identityCheck/context/types'

export const initialBookingState: any = {
  address: null,
}

export const BookingReducer = (
  state: BookingState,
  action: Action
): any => {
  switch (action.type) {
    case 'INIT':
      return initialBookingState
    case 'SET_ADDRESS':
      return { ...state, address: action.payload }
    default:
      return state
  }
}
