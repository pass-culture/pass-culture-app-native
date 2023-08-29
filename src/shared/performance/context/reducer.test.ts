import { Transaction } from '@sentry/types'

import {
  Action,
  initialPerformanceState,
  performanceReducer,
} from 'shared/performance/context/reducer'
import { PerformanceState } from 'shared/performance/types'

const transaction: Transaction = {
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
}

describe('Performance reducer', () => {
  const state = initialPerformanceState

  it('should handle START_TRANSACTION', () => {
    const action: Action = {
      type: 'START_TRANSACTION',
      payload: transaction,
    }
    expect(performanceReducer(state, action)).toStrictEqual({
      transactions: [transaction],
    })
  })

  it('should handle FINISH_TRANSACTION', () => {
    const performanceState: PerformanceState = { transactions: [transaction] }
    const action: Action = {
      type: 'FINISH_TRANSACTION',
      payload: 'Transaction1',
    }
    expect(performanceReducer(performanceState, action)).toStrictEqual({
      transactions: [],
    })
  })
})
