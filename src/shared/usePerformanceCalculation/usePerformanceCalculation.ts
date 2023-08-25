import { Transaction } from '@sentry/types'
import { useEffect, useRef } from 'react'

import { eventMonitoring } from 'libs/monitoring'
import {
  IActionner,
  ITransactions,
} from 'shared/usePerformanceCalculation/helpers/usePerformanceCalculationHelpers'

class SentryActionner extends IActionner {
  getName(transaction) {
    return transaction.name
  }

  startTransaction(name: string) {
    return eventMonitoring.startTransaction({ name })
  }

  endTransaction(transaction) {
    transaction.finish()
  }
}

export class SentryTransactions extends ITransactions {
  constructor() {
    super(new SentryActionner())
  }
}

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
  const transactions = useRef<ITransactions>(new SentryTransactions())

  const start = (name: string) => {
    transactions.current?.addTransaction(name)
  }

  const finish = (name: string) => {
    transactions.current?.removeTransaction(name)
  }

  // Only used to clean up the transaction's array
  useEffect(() => {
    return () => {
      delete transactions.current
      transactions.current = null
    }
  }, [])

  return {
    finish,
    start,
  }
}
