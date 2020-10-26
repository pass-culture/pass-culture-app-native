import { Batch, BatchPush } from '@bam.tech/react-native-batch'

export const startBatchNotification = (): void => {
  Batch.start()
  BatchPush.registerForRemoteNotifications() //  No effect on Android
}
