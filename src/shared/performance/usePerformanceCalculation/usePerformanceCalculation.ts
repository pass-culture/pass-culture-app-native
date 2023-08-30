import React from 'react'

import { usePerformance } from 'shared/performance/context/PerformanceWrapper'
import {
  getTransactionFromName,
  startTransaction,
} from 'shared/performance/helpers/performanceHelpers'

// Transaction name has seen in Sentry
// PERF_[PAGE_NAME]_GLOBAL | [NAME]
export const PERF_HOME_ZERO = 'HOME:ON_CREATE'
export const PERF_HOME_GLOBAL = 'HOME:AFTER_SKELETON'

// Start the hook in the first line of a component
// usePerformanceCalculation().start(PERF_NAME)
// Then stop it inside this one or a child component
// const {finish}=usePerformanceCalculation()
// finish(PERF_NAME)
export const usePerformanceCalculation = () => {
  const { performanceState, dispatch } = usePerformance()

  return React.useMemo(
    () => ({
      start: (name: string) => {
        const transaction = startTransaction(name)
        dispatch({
          type: 'START_TRANSACTION',
          payload: transaction,
        })
      },

      finish: (name: string) => {
        const transactionToFinish = getTransactionFromName(performanceState.transactions, name)

        if (transactionToFinish) {
          transactionToFinish.finish()

          dispatch({
            type: 'FINISH_TRANSACTION',
            payload: name,
          })
        }
      },
    }),
    [dispatch, performanceState.transactions]
  )
}
