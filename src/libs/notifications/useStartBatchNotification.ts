import { Batch, BatchPush } from '@bam.tech/react-native-batch'
import { useEffect } from 'react'

import { useTrackingConsent } from 'libs/trackingConsent'

export const useStartBatchNotification = (): void => {
  const { consentAsked } = useTrackingConsent()

  useEffect(() => {
    if (consentAsked) {
      Batch.start()
      BatchPush.registerForRemoteNotifications() //  No effect on Android
    }
  }, [consentAsked])
}
