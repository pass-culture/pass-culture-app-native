import '@sentry/tracing'
import { Transaction } from '@sentry/types'

import { eventMonitoring } from 'libs/monitoring'

// This is a workaround; see https://github.com/getsentry/sentry-javascript/issues/4731
// Check for updates, maybe they have a fix

export function startTransaction(name: string) {
  return eventMonitoring.startTransaction({ name })
}

export function getTransactionFromName(transactions: Transaction[], name: string) {
  return transactions.find((transaction) => transaction.name === name)
}
