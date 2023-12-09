import { eventMonitoring } from 'libs/monitoring'

import { startTransaction } from './transactions'

describe('startTransaction', () => {
  it('should start Sentry performance transaction with the name of the transaction', () => {
    startTransaction('Transaction1')

    expect(eventMonitoring.startTransaction).toHaveBeenNthCalledWith(1, { name: 'Transaction1' })
  })
})
