import { Transaction } from '@sentry/types'
import { useEffect, useRef } from 'react'

import {
  addTransaction,
  getTransaction,
  removeTransaction,
  transactionDoesNotExist,
} from 'shared/usePerformanceCalculation/helpers/usePerformanceCalculationHelpers'

export const usePerformanceCalculation = (name: string) => {
  const transactions = useRef<Transaction[]>([])

  if (transactionDoesNotExist(transactions.current, name)) {
    addTransaction(transactions.current, name)
  }

  const finish = (name: string) => {
    const transaction = getTransaction(transactions.current, name)
    if (transaction) {
      transaction.finish()
      removeTransaction(transactions.current, name)
    }
  }

  useEffect(() => {
    return () => {
      transactions.current.forEach((transaction) => transaction.finish())
    }
  }, [])

  return {
    finish: () => {
      finish(name)
    },
  }
}
