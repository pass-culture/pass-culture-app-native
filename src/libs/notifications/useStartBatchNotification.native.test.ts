import { renderHook } from '@testing-library/react-hooks'

import { BatchPush } from 'libs/react-native-batch'

import { useStartBatchNotification } from './useStartBatchNotification'

describe('startBatchNotification', () => {
  it('should call BatchPush.registerForRemoteNotifications', () => {
    renderHook(useStartBatchNotification)
    expect(BatchPush.registerForRemoteNotifications).toHaveBeenCalled()
  })
})
