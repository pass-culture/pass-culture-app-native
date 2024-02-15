import { env } from 'libs/environment'
import { firestoreRemoteStore } from 'libs/firebase/firestore/client'
import { RemoteStoreCollections, RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { captureMonitoringError } from 'libs/monitoring'

type FeatureFlagConfig = { minimalBuildNumber?: number; maximalBuildNumber?: number }

export const getFeatureFlag = (featureFlag: RemoteStoreFeatureFlags): Promise<FeatureFlagConfig> =>
  firestoreRemoteStore
    .collection(RemoteStoreCollections.FEATURE_FLAGS)
    .doc(env.ENV)
    .get()
    .then((docSnapshot) => {
      const firebaseFeatureFlag = docSnapshot.get<FeatureFlagConfig>(featureFlag)

      if (firebaseFeatureFlag === undefined) return {}
      return firebaseFeatureFlag
    })
    .catch((error) => {
      captureMonitoringError(error.message, 'firestore_not_available')
      return {}
    })
