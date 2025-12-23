import { firestoreRemoteStore, doc, getDoc } from 'libs/firebase/firestore/client'
import {
  FIRESTORE_ROOT_COLLECTION,
  RemoteStoreAppVersion,
  RemoteStoreDocuments,
} from 'libs/firebase/firestore/types'
import { captureMonitoringError } from 'libs/monitoring/errors'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'

export const getMinimalBuildNumber = async (): Promise<number | undefined> => {
  try {
    const docRef = doc(
      firestoreRemoteStore,
      FIRESTORE_ROOT_COLLECTION,
      RemoteStoreDocuments.APPLICATION_VERSIONS
    )

    const docSnapshot = await getDoc(docRef)

    return docSnapshot.get<number>(RemoteStoreAppVersion.MINIMAL_BUILD_NUMBER)
  } catch (error) {
    captureMonitoringError(getErrorMessage(error), 'firestore_not_available')
    return undefined
  }
}
