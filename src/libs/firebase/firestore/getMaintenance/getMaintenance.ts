import { firestoreRemoteStore } from 'libs/firebase/firestore/client'
import { FIRESTORE_ROOT_COLLECTION, RemoteStoreDocuments } from 'libs/firebase/firestore/types'
import { FirebaseFirestoreTypes } from 'libs/firebase/shims/firestore'
import { captureMonitoringError } from 'libs/monitoring/errors'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'

export const getMaintenance = async (): Promise<
  FirebaseFirestoreTypes.DocumentData | undefined | null
> => {
  try {
    const docSnapshot = await firestoreRemoteStore
      .collection(FIRESTORE_ROOT_COLLECTION)
      .doc(RemoteStoreDocuments.MAINTENANCE)
      .get()

    return docSnapshot.data() ?? {}
  } catch (error) {
    captureMonitoringError(getErrorMessage(error), 'firestore_not_available')
    return null
  }
}
