import { Transaction } from '@sentry/types'

import {
  getTransactionFromName,
  startTransaction,
} from 'shared/performance/helpers/performanceHelpers'

// Transaction name has seen in Sentry
// PERF_[PAGE_NAME]_GLOBAL | [NAME]
export const PERF_HOME_ZERO = 'HOME:ON_CREATE'
export const PERF_HOME_GLOBAL = 'HOME:AFTER_SKELETON'

const transactions: Transaction[] = []

// Start the hook in the first line of a component
// usePerformanceCalculation().start(PERF_NAME)
// Then stop it inside this one or a child component
// const {finish}=usePerformanceCalculation()
// finish(PERF_NAME)
export function usePerformanceCalculation() {
  return {
    start: (name: string) => {
      const existingTransaction = getTransactionFromName(transactions, name)

      if (!existingTransaction) {
        const transaction = startTransaction(name)

        if (transaction) {
          transactions.push(transaction)
        }
      } else {
        console.warn(
          `Transaction with name ${name} already exists. Please check your function calls.`
        )
      }
    },

    finish: (name: string) => {
      const transactionToFinish = getTransactionFromName(transactions, name)
      if (transactionToFinish) {
        transactionToFinish.finish()
        const transactionIndex = transactions.findIndex((item) => item.name === name)
        transactions.splice(transactionIndex, 1)
      } else {
        console.warn(
          `Transaction with name ${name} does not exist. Please check your function calls.`
        )
      }
    },
  }
}
