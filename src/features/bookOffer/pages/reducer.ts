import { CategoryType } from 'api/gen'

enum Step {
  DATE,
  HOUR,
  DUO,
}

export type BookingState = {
  category: CategoryType | undefined
  step: Step | undefined
}

export const initialBookingState: BookingState = {
  category: undefined,
  step: undefined,
}

export type Action = { type: 'INIT'; payload: Partial<BookingState> }

export const searchReducer = (state: BookingState, action: Action): BookingState => {
  switch (action.type) {
    case 'INIT':
      return { ...initialBookingState, ...action.payload }
    default:
      return state
  }
}
