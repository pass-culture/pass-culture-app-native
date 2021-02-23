export enum Step {
  DATE,
  HOUR,
  DUO,
  CONFIRMATION,
}

export type BookingState = {
  offerId: number | undefined
  stockId: number | undefined
  step: Step | undefined
  quantity: 1 | 2
}

export const initialBookingState: BookingState = {
  offerId: undefined,
  stockId: undefined,
  step: undefined,
  quantity: 1,
}

export type Action =
  | { type: 'INIT'; payload: Partial<BookingState> }
  | { type: 'VALIDATE_OPTIONS' }
  | { type: 'SELECT_QUANTITY'; payload: 1 | 2 }
  | { type: 'MODIFY_OPTIONS' }
  | { type: 'SELECT_STOCK'; payload: number }

export const searchReducer = (state: BookingState, action: Action): BookingState => {
  switch (action.type) {
    case 'INIT':
      return { ...initialBookingState, ...action.payload }
    case 'VALIDATE_OPTIONS':
      return { ...state, step: Step.CONFIRMATION }
    case 'SELECT_STOCK':
      return { ...state, stockId: action.payload }
    case 'SELECT_QUANTITY':
      return { ...state, quantity: action.payload }
    case 'MODIFY_OPTIONS':
      return { ...state, step: Step.DUO }
    default:
      return state
  }
}
