import { CategoryType } from 'api/gen'

export enum Step {
  DATE,
  HOUR,
  DUO,
  CONFIRMATION,
}

export type BookingState = {
  category: CategoryType | undefined
  step: Step | undefined
}

export const initialBookingState: BookingState = {
  category: undefined,
  step: undefined,
}

export type Action =
  | { type: 'INIT'; payload: Partial<BookingState> }
  | { type: 'VALIDATE_OPTIONS' }
  | { type: 'MODIFY_OPTIONS' }

export const searchReducer = (state: BookingState, action: Action): BookingState => {
  switch (action.type) {
    case 'INIT':
      return { ...initialBookingState, ...action.payload }
    case 'VALIDATE_OPTIONS':
      return { ...state, step: Step.CONFIRMATION }
    case 'MODIFY_OPTIONS':
      return { ...state, step: Step.DUO }
    default:
      return state
  }
}
