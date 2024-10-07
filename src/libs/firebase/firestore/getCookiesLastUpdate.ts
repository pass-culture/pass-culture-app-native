import { firestoreRemoteStore } from 'libs/firebase/firestore/client'
import {
  RemoteStoreDocuments,
  RemoteStoreCookies,
  FIRESTORE_ROOT_COLLECTION,
} from 'libs/firebase/firestore/types'
import { captureMonitoringError } from 'libs/monitoring/errors'

export const getCookiesLastUpdate = async (): Promise<
  | void
  | {
      lastUpdated: Date
      lastUpdateBuildVersion: number
    }
  | undefined
> => {
  return firestoreRemoteStore
    .collection(FIRESTORE_ROOT_COLLECTION)
    .doc(RemoteStoreDocuments.COOKIES_LAST_UPDATE)
    .get()
    .then((docSnapshot) => {
      const lastUpdated = new Date(
        docSnapshot.get<string>(RemoteStoreCookies.COOKIES_LAST_UPDATE_DATE)
      )
      const lastUpdateBuildVersion = docSnapshot.get<number>(
        RemoteStoreCookies.COOKIES_LAST_UPDATE_BUILD_VERSION
      )

      // If build version or date are undefined or invalid, return undefined
      if (lastUpdateBuildVersion === undefined || isNaN(lastUpdated.getTime())) return undefined
      return { lastUpdated, lastUpdateBuildVersion }
    })
    .catch((error) => {
      captureMonitoringError(error.message, 'firestore_not_available')
    })
}
