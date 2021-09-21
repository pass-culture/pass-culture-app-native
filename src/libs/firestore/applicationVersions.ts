import { Platform } from 'react-native'

import { env } from 'libs/environment'
import { firestoreRemoteStore } from 'libs/firestore/client'
import { RemoteStoreCollections, RemoteStoreDocuments } from 'libs/firestore/types'
import { MonitoringError } from 'libs/monitoring'

const minimalBuildNumberKey = Platform.select({
  default: RemoteStoreDocuments.MINIMAL_BUILD_NUMBER,
  web: RemoteStoreDocuments.MINIMAL_BUILD_NUMBER_WEB,
})

const applicationVersions = Platform.select({
  default: RemoteStoreCollections.APPLICATION_VERSIONS,
  web: RemoteStoreCollections.APPLICATION_VERSIONS_WEB,
})

export const minimalBuildNumberStatusListener = (
  onValueChange: (minimalBuildNumber: number) => void
) =>
  firestoreRemoteStore
    .collection(applicationVersions)
    .doc(env.ENV)
    .onSnapshot(
      (docSnapshot) => {
        onValueChange(docSnapshot.get(minimalBuildNumberKey))
      },
      (error) => {
        new MonitoringError(error.message, 'firestore_not_available')
      }
    )
