import { BatchPush } from 'libs/react-native-batch'
import { renderHook } from 'tests/utils'

import { useStartBatchNotification } from './useStartBatchNotification'

describe('startBatchNotification', () => {
  it('should call BatchPush.requestNotificationAuthorization', () => {
    renderHook(useStartBatchNotification)
    expect(BatchPush.requestNotificationAuthorization).toHaveBeenCalled()
  })
})
