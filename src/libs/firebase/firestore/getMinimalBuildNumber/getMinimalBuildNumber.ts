import { firestoreRemoteStore } from 'libs/firebase/firestore/client'
import {
  FIRESTORE_ROOT_COLLECTION,
  RemoteStoreAppVersion,
  RemoteStoreDocuments,
} from 'libs/firebase/firestore/types'
import { captureMonitoringError } from 'libs/monitoring'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'

export const getMinimalBuildNumber = async (): Promise<number | undefined> => {
  try {
    const docSnapshot = await firestoreRemoteStore
      .collection(FIRESTORE_ROOT_COLLECTION)
      .doc(RemoteStoreDocuments.APPLICATION_VERSIONS)
      .get()

    return docSnapshot.get<number>(RemoteStoreAppVersion.MINIMAL_BUILD_NUMBER)
  } catch (error) {
    captureMonitoringError(getErrorMessage(error), 'firestore_not_available')
    return undefined
  }
}
