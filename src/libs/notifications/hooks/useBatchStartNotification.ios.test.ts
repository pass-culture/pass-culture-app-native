import { Batch } from '@bam.tech/react-native-batch'
import { renderHook } from '@testing-library/react-hooks'

import { useBatchStartNotification } from './useBatchStartNotification.ios'

describe('useBatchStartNotification', () => {
  it('should not call Batch.start', () => {
    renderHook(useBatchStartNotification)
    expect(Batch.start).not.toHaveBeenCalled()
  })
})
