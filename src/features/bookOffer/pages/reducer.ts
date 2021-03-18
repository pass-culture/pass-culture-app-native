export enum Step {
  DATE = 1,
  HOUR = 2,
  DUO = 3,
  PRE_VALIDATION = 4,
  CONFIRMATION = 5,
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
  | { type: 'SET_OFFER_ID'; payload: number }
  | { type: 'VALIDATE_OPTIONS' }
  | { type: 'CHANGE_STEP'; payload: Step }
  | { type: 'SELECT_DATE'; payload: Date }
  | { type: 'SELECT_STOCK'; payload: number }
  | { type: 'SELECT_QUANTITY'; payload: 1 | 2 }
  | { type: 'RESET' }
  | { type: 'RESET_STOCK' }
  | { type: 'RESET_QUANTITY' }

export const bookOfferReducer = (state: BookingState, action: Action): BookingState => {
  switch (action.type) {
    case 'RESET':
      return { ...initialBookingState, offerId: state.offerId }
    case 'SET_OFFER_ID':
      return { ...initialBookingState, offerId: action.payload }
    case 'VALIDATE_OPTIONS':
      return { ...state, step: Step.CONFIRMATION }
    case 'SELECT_STOCK':
      return { ...state, stockId: action.payload }
    case 'RESET_STOCK':
      return { ...state, stockId: undefined }
    case 'SELECT_QUANTITY':
      return { ...state, quantity: action.payload }
    case 'RESET_QUANTITY':
      return { ...state, quantity: undefined }
    case 'CHANGE_STEP':
      return { ...state, step: action.payload }
    case 'SELECT_DATE':
      return { ...state, date: action.payload }
    default:
      return state
  }
}
