import { firestoreRemoteStore } from 'libs/firebase/firestore/client'
import { captureMonitoringError } from 'libs/monitoring'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'

export function updateFirestoreNetworkState(isConnected: boolean) {
  try {
    if (isConnected) {
      firestoreRemoteStore.enableNetwork()
    } else {
      firestoreRemoteStore.disableNetwork()
    }
  } catch (error) {
    captureMonitoringError(getErrorMessage(error), 'Error updating Firestore network state')
  }
}
