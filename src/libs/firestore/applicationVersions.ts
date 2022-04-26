import { env } from 'libs/environment'
import { firestoreRemoteStore } from 'libs/firestore/client'
import { RemoteStoreCollections, RemoteStoreDocuments } from 'libs/firestore/types'
import { captureMonitoringError } from 'libs/monitoring'

export const minimalBuildNumberStatusListener = (
  onValueChange: (minimalBuildNumber: number) => void
) =>
  firestoreRemoteStore
    .collection(RemoteStoreCollections.APPLICATION_VERSIONS)
    .doc(env.ENV)
    .onSnapshot(
      (docSnapshot) => {
        onValueChange(docSnapshot.get(RemoteStoreDocuments.MINIMAL_BUILD_NUMBER))
      },
      (error) => {
        captureMonitoringError(error.message, 'firestore_not_available')
      }
    )
