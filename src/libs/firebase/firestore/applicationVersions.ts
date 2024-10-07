import { firestoreRemoteStore } from 'libs/firebase/firestore/client'
import {
  FIRESTORE_ROOT_COLLECTION,
  RemoteStoreAppVersion,
  RemoteStoreDocuments,
} from 'libs/firebase/firestore/types'
import { captureMonitoringError } from 'libs/monitoring'

export const minimalBuildNumberStatusListener = (
  onValueChange: (minimalBuildNumber: number) => void
) =>
  firestoreRemoteStore
    .collection(FIRESTORE_ROOT_COLLECTION)
    .doc(RemoteStoreDocuments.APPLICATION_VERSIONS)
    .onSnapshot(
      (docSnapshot) => {
        onValueChange(docSnapshot.get(RemoteStoreAppVersion.MINIMAL_BUILD_NUMBER))
      },
      (error) => {
        captureMonitoringError(error.message, 'firestore_not_available')
      }
    )
