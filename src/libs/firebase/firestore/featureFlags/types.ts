import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { FirebaseFirestoreTypes } from 'libs/firebase/shims/firestore'

export type squads = 'decouverte' | 'activation' | 'conversion'

export type FeatureFlagConfig = {
  minimalBuildNumber?: number
  maximalBuildNumber?: number
  owner?: squads
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: Record<string, any> // Tried with unknown but got: Type 'Record<string, unknown>' is not assignable to type 'DocumentFieldType'.
}

export type FeatureFlagStore = Record<RemoteStoreFeatureFlags, FeatureFlagConfig>

export type FeatureFlagDocument = FirebaseFirestoreTypes.DocumentSnapshot<FeatureFlagStore>
