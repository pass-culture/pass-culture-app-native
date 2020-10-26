import { Batch, BatchPush } from '@bam.tech/react-native-batch'

import { startBatchNotification } from './startBatchNotification'

describe('startBatchNotification', () => {
  it('should call Batch.start', () => {
    startBatchNotification()
    expect(Batch.start).toHaveBeenCalledTimes(1)
  })

  it('should call BatchPush.registerForRemoteNotifications', () => {
    startBatchNotification()
    expect(BatchPush.registerForRemoteNotifications).toHaveBeenCalled()
  })
})
