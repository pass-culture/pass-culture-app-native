import firestore from '@react-native-firebase/firestore'

import { env } from 'libs/environment'
import { MonitoringError } from 'libs/errorMonitoring'

const firestoreRemoteStore = firestore()

enum RemoteStoreCollections {
  MAINTENANCE = 'maintenance',
}

enum RemoteStoreDocuments {
  MAINTENANCE_IS_ON = 'maintenanceIsOn',
}

export const maintenanceStatusListener = (onValueChange: (maintenanceStatus: boolean) => void) =>
  firestoreRemoteStore
    .collection(RemoteStoreCollections.MAINTENANCE)
    .doc(env.ENV)
    .onSnapshot(
      (docSnapshot) => {
        onValueChange(docSnapshot.get(RemoteStoreDocuments.MAINTENANCE_IS_ON))
      },
      (error) => {
        new MonitoringError(error.message, 'firestore_not_available')
      }
    )
