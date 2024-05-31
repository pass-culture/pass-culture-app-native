import { useMemo } from 'react'

import { isFeatureFlagActive } from 'libs/firebase/firestore/featureFlags/isFeatureFlagActive'
import { useGetFeatureFlagDocSnapshot } from 'libs/firebase/firestore/featureFlags/useGetFeatureFlagDocSnapshot'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export const useGetAllFeatureFlags = () => {
  const docSnapshot = useGetFeatureFlagDocSnapshot()
  const featureFlags = useMemo(
    () =>
      (Object.keys(RemoteStoreFeatureFlags) as RemoteStoreFeatureFlags[]).reduce(
        (previous, current) => {
          return {
            ...previous,
            [current]: isFeatureFlagActive(current, docSnapshot),
          }
        },
        {} as Record<keyof typeof RemoteStoreFeatureFlags, boolean>
      ),
    [docSnapshot]
  )

  return featureFlags
}
