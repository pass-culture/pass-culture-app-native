import { env } from 'libs/environment'
import { firestoreRemoteStore } from 'libs/firebase/firestore/client'
import { RemoteStoreCollections, RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { captureMonitoringError } from 'libs/monitoring'

export const getFeatureFlag = (
  featureFlag: RemoteStoreFeatureFlags
): Promise<void | { minimalBuildNumber: number } | null> =>
  firestoreRemoteStore
    .collection(RemoteStoreCollections.FEATURE_FLAGS)
    .doc(env.ENV)
    .get()
    .then((docSnapshot) => {
      const firebaseFeatureFlag = docSnapshot.get<{ minimalBuildNumber: number }>(featureFlag)

      if (firebaseFeatureFlag === undefined) return null
      return firebaseFeatureFlag
    })
    .catch((error) => {
      captureMonitoringError(error.message, 'firestore_not_available')
    })
