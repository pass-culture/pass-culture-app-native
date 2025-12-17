import { firestoreRemoteStore, doc, getDoc } from 'libs/firebase/firestore/client'
import { FIRESTORE_ROOT_COLLECTION, RemoteStoreDocuments } from 'libs/firebase/firestore/types'
import { DocumentData } from 'libs/firebase/shims/firestore'
import { captureMonitoringError } from 'libs/monitoring/errors'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'

export const getMaintenance = async (): Promise<DocumentData | undefined | null> => {
  try {
    // 1. Create reference
    const docRef = doc(
      firestoreRemoteStore,
      FIRESTORE_ROOT_COLLECTION,
      RemoteStoreDocuments.MAINTENANCE
    )

    // 2. Fetch snapshot
    const docSnapshot = await getDoc(docRef)

    return docSnapshot.data() ?? {}
  } catch (error) {
    captureMonitoringError(getErrorMessage(error), 'firestore_not_available')
    return null
  }
}
