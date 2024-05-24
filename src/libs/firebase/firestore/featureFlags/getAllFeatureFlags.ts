import { env } from 'libs/environment'
import { firestoreRemoteStore } from 'libs/firebase/firestore/client'
import { FeatureFlagDocument, FeatureFlagStore } from 'libs/firebase/firestore/featureFlags/types'
import { RemoteStoreCollections } from 'libs/firebase/firestore/types'
import { captureMonitoringError } from 'libs/monitoring'

export const getAllFeatureFlags = (): Promise<FeatureFlagDocument> | null => {
  try {
    return firestoreRemoteStore
      .collection<FeatureFlagStore>(RemoteStoreCollections.FEATURE_FLAGS)
      .doc(env.ENV)
      .get()
  } catch (error) {
    captureMonitoringError((error as Error).message, 'firestore_not_available')
    return null
  }
}
