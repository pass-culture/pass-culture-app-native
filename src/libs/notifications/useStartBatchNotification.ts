import { Batch, BatchPush } from '@bam.tech/react-native-batch'
import { useEffect } from 'react'

export const useStartBatchNotification = (): void => {
  useEffect(() => {
    Batch.start()
    BatchPush.registerForRemoteNotifications() //  No effect on Android
  }, [])
}
