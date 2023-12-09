import '@sentry/tracing'
import { Span, Transaction } from '@sentry/types'

import { eventMonitoring } from 'libs/monitoring'
import { getCurrentHub } from 'libs/monitoring/sentry'

const transactionsRef: { [key: string]: { transaction: Transaction; span: Span } | undefined } = {}

export function startTransaction(name: string) {
  if (transactionsRef[name]) {
    finishTransaction(name)
  }
  const transaction = eventMonitoring.startTransaction({ name })
  getCurrentHub()?.configureScope((scope) => scope.setSpan(transaction))
  const span = transaction?.startChild({ op: 'performance' })
  transactionsRef[name] = { transaction, span }
}

export function finishTransaction(name: string) {
  if (!transactionsRef[name]) return
  transactionsRef[name]?.span?.finish()
  transactionsRef[name]?.transaction?.finish()
  transactionsRef[name] = undefined
}
