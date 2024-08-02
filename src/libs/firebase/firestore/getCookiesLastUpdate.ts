// eslint-disable-next-line no-restricted-imports
import { fetch } from '@react-native-community/netinfo'

import { env } from 'libs/environment'
import { firestoreRemoteStore } from 'libs/firebase/firestore/client'
import { RemoteStoreCollections, RemoteStoreDocuments } from 'libs/firebase/firestore/types'
import { captureMonitoringError } from 'libs/monitoring'

export const getCookiesLastUpdate = async (): Promise<
  | void
  | {
      lastUpdated: Date
      lastUpdateBuildVersion: number
    }
  | undefined
> => {
  const networkStatus = await fetch()
  if (networkStatus.isInternetReachable) {
    await firestoreRemoteStore.enableNetwork()
  } else {
    /**
     * While the network is disabled, any snapshot listeners or get() calls
     * will return results from cache, and any write operations will be queued
     * until the network is restored.
     */
    await firestoreRemoteStore.disableNetwork()
  }

  return firestoreRemoteStore
    .collection(RemoteStoreCollections.COOKIES_LAST_UPDATE)
    .doc(env.ENV)
    .get()
    .then((docSnapshot) => {
      const lastUpdated = new Date(
        docSnapshot.get<string>(RemoteStoreDocuments.COOKIES_LAST_UPDATE_DATE)
      )
      const lastUpdateBuildVersion = docSnapshot.get<number>(
        RemoteStoreDocuments.COOKIES_LAST_UPDATE_BUILD_VERSION
      )

      // If build version or date are undefined or invalid, return undefined
      if (lastUpdateBuildVersion === undefined || isNaN(lastUpdated.getTime())) return undefined
      return { lastUpdated, lastUpdateBuildVersion }
    })
    .catch((error) => {
      captureMonitoringError(error.message, 'firestore_not_available')
    })
}
