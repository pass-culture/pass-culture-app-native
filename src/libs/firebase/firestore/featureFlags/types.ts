import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { FirebaseFirestoreTypes } from 'libs/firebase/shims/firestore'

export type FeatureFlagConfig = { minimalBuildNumber?: number; maximalBuildNumber?: number }

export type FeatureFlagStore = Record<RemoteStoreFeatureFlags, FeatureFlagConfig>

export type FeatureFlagDocument = FirebaseFirestoreTypes.DocumentSnapshot<FeatureFlagStore>
