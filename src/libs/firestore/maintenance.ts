import { env } from 'libs/environment'
import firestoreRemoteStore from 'libs/firestore/client'
import { RemoteStoreCollections, RemoteStoreDocuments } from 'libs/firestore/types'
import { MonitoringError } from 'libs/monitoring'

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
