import { BatchPush } from '@bam.tech/react-native-batch'
import { renderHook } from '@testing-library/react-hooks'

import { useStartBatchNotification } from './useStartBatchNotification'

describe('startBatchNotification', () => {
  it('should call BatchPush.registerForRemoteNotifications', () => {
    renderHook(useStartBatchNotification)
    expect(BatchPush.registerForRemoteNotifications).toHaveBeenCalled()
  })
})
