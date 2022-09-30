import { useEffect } from 'react'

import { BatchPush } from 'libs/react-native-batch'

export const useStartBatchNotification = (): void => {
  useEffect(() => {
    BatchPush.requestNotificationAuthorization() //  For iOS and Android 13
  }, [])
}
