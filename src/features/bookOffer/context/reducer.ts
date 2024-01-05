export enum Step {
  DATE = 1,
  HOUR = 2,
  PRICE = 3,
  DUO = 4,
  CONFIRMATION = 5,
}

export const STEP_LABEL: Record<Step, string> = {
  [Step.DATE]: 'Date',
  [Step.HOUR]: 'Horaire',
  [Step.PRICE]: 'Prix',
  [Step.DUO]: 'Nombre de places',
  [Step.CONFIRMATION]: 'Confirmation',
}

export type BookingState = {
  offerId: number | undefined
  stockId: number | undefined
  step: Step
  quantity: 1 | 2 | undefined
  date: Date | undefined
  hour: string | undefined
}

export const initialBookingState: BookingState = {
  offerId: undefined,
  stockId: undefined,
  step: Step.DATE,
  quantity: undefined,
  date: undefined,
  hour: undefined,
}

export type Action =
  | { type: 'SET_OFFER_ID'; payload: number }
  | { type: 'VALIDATE_OPTIONS' }
  | { type: 'CHANGE_STEP'; payload: Step }
  | { type: 'CHANGE_OFFER'; payload: number }
  | { type: 'SELECT_DATE'; payload: Date }
  | { type: 'SELECT_HOUR'; payload: string }
  | { type: 'SELECT_STOCK'; payload: number }
  | { type: 'SELECT_QUANTITY'; payload: 1 | 2 }
  | { type: 'RESET' }
  | { type: 'RESET_HOUR' }
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
    case 'SELECT_HOUR':
      return { ...state, hour: action.payload }
    case 'RESET_HOUR':
      return { ...state, hour: undefined }
    case 'CHANGE_OFFER':
      return { ...state, offerId: action.payload }
    default:
      return state
  }
}
