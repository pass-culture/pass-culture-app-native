import { Batch } from '@bam.tech/react-native-batch'
import { renderHook } from '@testing-library/react-hooks'

import { useBatchStartNotification } from './useBatchStartNotification.android'

describe('useBatchStartNotification', () => {
  it('should call Batch.start', () => {
    renderHook(useBatchStartNotification)
    expect(Batch.start).toHaveBeenCalledTimes(1)
  })
})
