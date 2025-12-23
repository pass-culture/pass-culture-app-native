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
  const docRef = doc(
    firestoreRemoteStore,
    FIRESTORE_ROOT_COLLECTION,
    RemoteStoreDocuments.COOKIES_LAST_UPDATE
  )

  return getDoc(docRef)
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
      captureMonitoringError(getErrorMessage(error), 'firestore_not_available')
    })
}
