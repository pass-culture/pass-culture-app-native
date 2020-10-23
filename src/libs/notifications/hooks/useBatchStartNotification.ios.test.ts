import { Batch, BatchPush } from '@bam.tech/react-native-batch'
import { renderHook } from '@testing-library/react-hooks'

import { useBatchStartNotification } from './useBatchStartNotification.ios'

describe('useBatchStartNotification', () => {
  it('should call Batch.start', () => {
    renderHook(useBatchStartNotification)
    expect(Batch.start).toHaveBeenCalledTimes(1)
  })

  it('should call BatchPush.registerForRemoteNotifications', () => {
    renderHook(useBatchStartNotification)
    expect(BatchPush.registerForRemoteNotifications).toHaveBeenCalled()
  })
})
