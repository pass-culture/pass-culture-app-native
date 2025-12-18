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

    return docSnapshot.get(RemoteStoreAppVersion.MINIMAL_BUILD_NUMBER) as number | undefined // .get() method returns a generic type (DocumentFieldType) which includes null, string, object, etc. DocumentFieldType only exists from RN lib (not web)
  } catch (error) {
    captureMonitoringError(getErrorMessage(error), 'firestore_not_available')
    return undefined
  }
}
