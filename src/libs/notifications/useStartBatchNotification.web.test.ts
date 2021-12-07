import { renderHook } from '@testing-library/react-hooks'

import { BatchPush } from 'libs/react-native-batch'

import { useStartBatchNotification } from './useStartBatchNotification'

describe('startBatchNotification web', () => {
  beforeAll(() => {
    const script = document.createElement('script')
    document.body.appendChild(script)
  })
  it('should call BatchPush.registerForRemoteNotifications', () => {
    renderHook(useStartBatchNotification)
    expect(BatchPush.registerForRemoteNotifications).toHaveBeenCalled()
  })
})
