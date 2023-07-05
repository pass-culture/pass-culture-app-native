export interface BookingState {
    address: string | null
}

export type Action =
  | { type: 'INIT' }
  | { type: 'SET_ADDRESS'; payload: SubscriptionState }

