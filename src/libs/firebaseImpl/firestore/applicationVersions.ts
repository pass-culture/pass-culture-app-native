// eslint-disable-next-line no-restricted-imports
import { collection, doc, onSnapshot } from 'firebase/firestore'

import { env } from 'libs/environment'
import { firestoreRemoteStore } from 'libs/firebaseImpl/firestore/client'
import { RemoteStoreCollections, RemoteStoreDocuments } from 'libs/firebaseImpl/firestore/types'
import { captureMonitoringError } from 'libs/monitoring'

export const minimalBuildNumberStatusListener = (
  onValueChange: (minimalBuildNumber: number) => void
) =>
  onSnapshot(
    doc(collection(firestoreRemoteStore, RemoteStoreCollections.APPLICATION_VERSIONS), env.ENV),
    (docSnapshot) => {
      onValueChange(docSnapshot.get(RemoteStoreDocuments.MINIMAL_BUILD_NUMBER))
    },
    (error) => {
      captureMonitoringError(error.message, 'firestore_not_available')
    }
  )
