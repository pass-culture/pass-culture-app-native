import { FunctionComponent, useEffect } from 'react'

import { firestoreRemoteStore } from 'libs/firebase/firestore/client'
import { captureMonitoringError } from 'libs/monitoring/errors'
import { useNetInfo } from 'libs/network/useNetInfo'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'

export const FirestoreNetworkObserver: FunctionComponent = () => {
  const { isConnected, isInternetReachable } = useNetInfo()

  useEffect(() => {
    try {
      if (isConnected) {
        firestoreRemoteStore.enableNetwork()
      } else {
        firestoreRemoteStore.disableNetwork()
      }
    } catch (error) {
      captureMonitoringError(getErrorMessage(error), 'Error updating Firestore network state')
    }
  }, [isConnected, isInternetReachable])

  return null
}
