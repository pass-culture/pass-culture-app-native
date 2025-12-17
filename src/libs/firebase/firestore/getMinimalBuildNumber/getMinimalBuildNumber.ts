import {
  firestoreRemoteStore,
  doc,
  getDoc, // Import the modular function
} from 'libs/firebase/firestore/client'
import {
  FIRESTORE_ROOT_COLLECTION,
  RemoteStoreAppVersion,
  RemoteStoreDocuments,
} from 'libs/firebase/firestore/types'
import { captureMonitoringError } from 'libs/monitoring/errors'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'

export const getMinimalBuildNumber = async (): Promise<number | undefined> => {
  try {
    // 1. Create the reference using the modular `doc` function
    // Syntax: doc(firestoreInstance, collectionPath, docId)
    const docRef = doc(
      firestoreRemoteStore,
      FIRESTORE_ROOT_COLLECTION,
      RemoteStoreDocuments.APPLICATION_VERSIONS
    )

    // 2. Fetch the document using the modular `getDoc` function
    const docSnapshot = await getDoc(docRef)

    // 3. Access data (The snapshot object itself retains .get() and .data() methods in RNF)
    return docSnapshot.get(RemoteStoreAppVersion.MINIMAL_BUILD_NUMBER)
  } catch (error) {
    captureMonitoringError(getErrorMessage(error), 'firestore_not_available')
    return undefined
  }
}
