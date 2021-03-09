export enum Step {
  DATE = 1,
  HOUR = 2,
  DUO = 3,
  CONFIRMATION = 4,
}

export type BookingState = {
  offerId: number | undefined
  stockId: number | undefined
  step: Step | undefined
  quantity: 1 | 2 | undefined
  date: Date | undefined
}

export const initialBookingState: BookingState = {
  offerId: undefined,
  stockId: undefined,
  step: Step.DATE,
  quantity: undefined,
  date: undefined,
}

export type Action =
  | { type: 'INIT'; payload: Partial<BookingState> }
  | { type: 'VALIDATE_OPTIONS' }
  | { type: 'SELECT_QUANTITY'; payload: 1 | 2 }
  | { type: 'CHANGE_STEP'; payload: Step }
  | { type: 'SELECT_STOCK'; payload: number }
  | { type: 'SELECT_DATE'; payload: Date }

export const bookOfferReducer = (state: BookingState, action: Action): BookingState => {
  switch (action.type) {
    case 'INIT':
      return { ...initialBookingState, ...action.payload }
    case 'VALIDATE_OPTIONS':
      return { ...state, step: Step.CONFIRMATION }
    case 'SELECT_STOCK':
      return { ...state, stockId: action.payload }
    case 'SELECT_QUANTITY':
      return { ...state, quantity: action.payload }
    case 'CHANGE_STEP':
      return { ...state, step: action.payload }
    case 'SELECT_DATE':
      return { ...state, date: action.payload }
    default:
      return state
  }
}
