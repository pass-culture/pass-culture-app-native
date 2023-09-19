import { Transaction } from '@sentry/types'

import { eventMonitoring } from 'libs/monitoring'

export function startTransaction(name: string) {
  return eventMonitoring.startTransaction({ name })
}

export function getTransactionFromName(transactions: Transaction[], name: string) {
  return transactions.find((transaction) => transaction.name === name)
}
