import { firestoreRemoteStore, doc, getDoc } from 'libs/firebase/firestore/client'
import {
  FIRESTORE_ROOT_COLLECTION,
  RemoteStoreCookies,
  RemoteStoreDocuments,
} from 'libs/firebase/firestore/types'
import { captureMonitoringError } from 'libs/monitoring/errors'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'

export const getCookiesLastUpdate = async (): Promise<
  | void
  | {
      lastUpdated: Date
      lastUpdateBuildVersion: number
    }
  | undefined
> => {
  // 1. Create the reference using the modular syntax
  const docRef = doc(
    firestoreRemoteStore,
    FIRESTORE_ROOT_COLLECTION,
    RemoteStoreDocuments.COOKIES_LAST_UPDATE
  )

  // 2. Fetch using getDoc()
  return getDoc(docRef)
    .then((docSnapshot) => {
      // Note: The snapshot object itself behaves the same way,
      // so .get() and .data() inside the callback still work.
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
      captureMonitoringError(getErrorMessage(error), 'firestore_not_available')
    })
}
