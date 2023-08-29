import { Transaction } from '@sentry/types'

import { PerformanceState } from 'shared/performance/types'

export const initialPerformanceState: PerformanceState = {
  transactions: [],
}

export type Action =
  | { type: 'START_TRANSACTION'; payload: Transaction }
  | { type: 'FINISH_TRANSACTION'; payload: string }

export const performanceReducer = (
  state = initialPerformanceState,
  action: Action
): PerformanceState => {
  switch (action.type) {
    case 'START_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] }
    case 'FINISH_TRANSACTION': {
      const transactionsWithoutFinishedOne = state.transactions.filter(
        (transaction) => transaction.name !== action.payload
      )

      return {
        ...state,
        transactions: transactionsWithoutFinishedOne,
      }
    }
    default:
      return state
  }
}
