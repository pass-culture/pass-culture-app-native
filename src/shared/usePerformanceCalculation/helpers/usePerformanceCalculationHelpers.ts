import { Transaction } from '@sentry/types'

import { eventMonitoring } from 'libs/monitoring'

export function getTransaction(transactions: Transaction[], name: string) {
  return transactions.find((transaction) => transaction.name === name)
}

export function transactionDoesNotExist(transactions: Transaction[], name: string) {
  return transactions.find((transaction) => transaction.name === name) === undefined
}

export function addTransaction(transactions: Transaction[], name: string) {
  const transaction = eventMonitoring.startTransaction({ name })
  transactions.push(transaction)
}

export function removeTransaction(transactions: Transaction[], name: string) {
  const itemIndex = transactions.findIndex((transaction) => transaction.name === name)
  if (itemIndex > -1) {
    transactions.splice(itemIndex, 1)
  }
}
