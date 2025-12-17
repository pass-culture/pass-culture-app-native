import { firestoreRemoteStore, doc, getDoc } from 'libs/firebase/firestore/client'
import { FeatureFlagDocument } from 'libs/firebase/firestore/featureFlags/types'
import { FIRESTORE_ROOT_COLLECTION, RemoteStoreDocuments } from 'libs/firebase/firestore/types'
import { captureMonitoringError } from 'libs/monitoring/errors'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'

export const getAllFeatureFlags = async (): Promise<FeatureFlagDocument | null> => {
  try {
    const docRef = doc(
      firestoreRemoteStore,
      FIRESTORE_ROOT_COLLECTION,
      RemoteStoreDocuments.FEATURE_FLAGS
    )

    // Retrieve the doc and cast it to your specific type
    // (Restoring the type safety previously provided by .collection<FeatureFlagStore>)
    return (await getDoc(docRef)) as unknown as FeatureFlagDocument
  } catch (error) {
    captureMonitoringError(getErrorMessage(error), 'firestore_not_available')
    return null
  }
}
