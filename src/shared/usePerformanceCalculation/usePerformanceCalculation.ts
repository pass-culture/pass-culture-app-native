import { Transaction } from '@sentry/types'
import { useEffect, useRef } from 'react'

import {
  addTransaction,
  getTransaction,
  removeTransaction,
  transactionDoesNotExist,
} from 'shared/usePerformanceCalculation/helpers/usePerformanceCalculationHelpers'

// Transaction name has seen in Sentry
// PERF_[PAGE_NAME]_GLOBAL | [NAME]
export const PERF_HOME_ZERO = 'HOME:ZERO:1'
export const PERF_HOME_GLOBAL = 'HOME:GLOBAL:2'

// Start the hook in the first line of a component
// usePerformanceCalculation().start(PERF_NAME)
// Then stop it inside this one or a child component
// const {finish}=usePerformanceCalculation()
// finish(PERF_NAME)
export const usePerformanceCalculation = () => {
  const transactions = useRef<Transaction[]>([])

  const start = (name: string) => {
    if (transactionDoesNotExist(transactions.current, name)) {
      addTransaction(transactions.current, name)
    }
  }

  const finish = (name: string) => {
    const transaction = getTransaction(transactions.current, name)
    if (transaction) {
      removeTransaction(transactions.current, name)
    }
  }

  // Only used to clean up the transaction's array
  useEffect(() => {
    return () => {
      transactions.current.forEach((transaction) => transaction.finish())
      transactions.current = []
    }
  }, [])

  return {
    finish,
    start,
  }
}
