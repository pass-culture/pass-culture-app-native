import { firestoreRemoteStore } from 'libs/firebase/firestore/client'
import { FeatureFlagDocument, FeatureFlagStore } from 'libs/firebase/firestore/featureFlags/types'
import { FIRESTORE_ROOT_COLLECTION, RemoteStoreDocuments } from 'libs/firebase/firestore/types'
import { captureMonitoringError } from 'libs/monitoring'

export const getAllFeatureFlags = async (): Promise<FeatureFlagDocument | null> => {
  try {
    return await firestoreRemoteStore
      .collection<FeatureFlagStore>(FIRESTORE_ROOT_COLLECTION)
      .doc(RemoteStoreDocuments.FEATURE_FLAGS)
      .get()
  } catch (error) {
    captureMonitoringError((error as Error).message, 'firestore_not_available')
    return null
  }
}
