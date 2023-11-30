import '@sentry/tracing'
import { Transaction } from '@sentry/types'

import { eventMonitoring } from 'libs/monitoring'
import {
  getTransactionFromName,
  startTransaction,
} from 'shared/performance/helpers/performanceHelpers'

const transactions: Transaction[] = []

// This is a workaround; see https://github.com/getsentry/sentry-javascript/issues/4731
// Check for updates, maybe they have a fix

// Start the hook in the first line of a component
// usePerformanceCalculation().start(PERFORMANCE_TRANSACTION_NAME)
// Then stop it inside this one or a child component
// const {finish}=usePerformanceCalculation()
// finish(PERFORMANCE_TRANSACTION_NAME)
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
        eventMonitoring.captureMessage(
          `Transaction with name ${name} already exists. Please check your function calls.`,
          'info'
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
        eventMonitoring.captureMessage(
          `Transaction with name ${name} does not exist. Please check your function calls.`,
          'info'
        )
      }
    },
  }
}
