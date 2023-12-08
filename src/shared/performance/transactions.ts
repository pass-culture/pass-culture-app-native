import * as Sentry from '@sentry/react-native'
import '@sentry/tracing'
import { Span, Transaction } from '@sentry/types'

import { eventMonitoring } from 'libs/monitoring'

const transactionsRef: { [key: string]: { transaction: Transaction; span: Span } | undefined } = {}

export function startTransaction(name: string) {
  if (transactionsRef[name]) {
    finishTransaction(name)
  }
  const transaction = eventMonitoring.startTransaction({ name })
  Sentry.getCurrentHub()?.configureScope((scope) => scope.setSpan(transaction))
  const span = transaction?.startChild({ op: 'performance' })
  transactionsRef[name] = { transaction, span }
}

export function finishTransaction(name: string) {
  if (!transactionsRef[name]) return
  transactionsRef[name]?.span?.finish()
  transactionsRef[name]?.transaction?.finish()
  transactionsRef[name] = undefined
}
