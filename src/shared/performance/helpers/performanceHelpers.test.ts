import { Transaction } from '@sentry/types'

import { eventMonitoring } from 'libs/monitoring'
import {
  getTransactionFromName,
  startTransaction,
} from 'shared/performance/helpers/performanceHelpers'

const transactions: Transaction[] = [
  {
    op: 'default',
    spanId: '8054bbcd99f33438',
    startTimestamp: 1693399853.6743155,
    traceId: '85af52486b814333aa33042a8f534d90',
    name: 'Transaction1',
    tags: {},
    data: {},
    metadata: { source: 'custom', spanMetadata: {} },
    instrumenter: 'sentry',
    setName: jest.fn(),
    setContext: jest.fn(),
    setMeasurement: jest.fn(),
    toContext: jest.fn(),
    updateWithContext: jest.fn(),
    setMetadata: jest.fn(),
    getDynamicSamplingContext: jest.fn(),
    finish: jest.fn(),
    setTag: jest.fn(),
    setData: jest.fn(),
    setStatus: jest.fn(),
    setHttpStatus: jest.fn(),
    startChild: jest.fn(),
    isSuccess: jest.fn(),
    toTraceparent: jest.fn(),
    getTraceContext: jest.fn(),
    toJSON: jest.fn(),
  },
]

describe('startTransaction', () => {
  it('should start Sentry performance transaction with the name of the transaction', () => {
    startTransaction('Transaction1')

    expect(eventMonitoring.startTransaction).toHaveBeenNthCalledWith(1, { name: 'Transaction1' })
  })
})

describe('getTransactionFromName', () => {
  it('should return a transaction when name exist in transaction array', () => {
    const transaction = getTransactionFromName(transactions, 'Transaction1')

    expect(transaction).toEqual(transactions[0])
  })

  it('should return undefined when name not exist in transaction array', () => {
    const transaction = getTransactionFromName(transactions, 'Transaction2')

    expect(transaction).toBeUndefined()
  })
})
