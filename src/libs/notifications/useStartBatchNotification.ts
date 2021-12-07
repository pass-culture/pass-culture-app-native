import { useEffect } from 'react'

import { BatchPush } from 'libs/react-native-batch'

export const useStartBatchNotification = (): void => {
  useEffect(() => {
    BatchPush.registerForRemoteNotifications() //  No effect on Android
  }, [])
}
