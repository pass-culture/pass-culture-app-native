import { NavigationState } from '@react-navigation/native'

import { RootStackParamList } from 'features/navigation/RootNavigator/types'
import { isFeatureFlagEnabled } from 'libs/firebase/firestore/featureFlags/featureFlagUtils'
import { FeatureFlagConfig, FeatureFlagDocument } from 'libs/firebase/firestore/featureFlags/types'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

const featureFlagRouteMap: Record<string, RemoteStoreFeatureFlags> = {
  Artist: RemoteStoreFeatureFlags.WIP_ARTIST_PAGE,
} satisfies Partial<Record<keyof RootStackParamList, RemoteStoreFeatureFlags>>

/**
 * Check for feature-flag driven pages and reset navigation state if needed.
 */
export const resetNavigationStateUponFeatureFlags = async (
  state?: NavigationState,
  featureFlagDocument?: FeatureFlagDocument | null
) => {
  if (state?.routes?.length) {
    const lastRouteName = state.routes.at(-1)?.name ?? ''
    const routeFeatureFlagId = featureFlagRouteMap[lastRouteName]

    if (featureFlagDocument && routeFeatureFlagId) {
      const featureFlagConfig = await featureFlagDocument.get<FeatureFlagConfig>(
        routeFeatureFlagId as RemoteStoreFeatureFlags
      )

      if (!isFeatureFlagEnabled(featureFlagConfig)) {
        const routes =
          state.routes.length === 1
            ? [{ key: 'TabNavigator', name: 'TabNavigator' }]
            : state.routes.slice(0, state.routes.length - 1)
        const index = Math.max(state.index - 1, 0)
        const newState: NavigationState = {
          ...state,
          routes,
          index,
        }
        return newState
      }
    }
  }
  return state
}
