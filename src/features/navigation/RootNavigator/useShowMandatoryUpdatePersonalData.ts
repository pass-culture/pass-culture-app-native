import { useEffect, useCallback } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { navigationRef } from 'features/navigation/navigationRef'
import { useAppStateChange } from 'libs/appState'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'

export function useShowMandatoryUpdatePersonalData() {
  const { isLoggedIn, user } = useAuthContext()
  const { data } = useRemoteConfigQuery()
  const displayMandatoryUpdatePersonalData = data?.displayMandatoryUpdatePersonalData
  const enableMandatoryUpdatePersonalData = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_MANDATORY_UPDATE_PERSONAL_DATA
  )

  const showEnableMandatoryUpdatePersonalData =
    user &&
    isLoggedIn &&
    user.hasProfileExpired &&
    enableMandatoryUpdatePersonalData &&
    displayMandatoryUpdatePersonalData

  const navigateToMandatoryUpdate = useCallback(() => {
    if (navigationRef.isReady()) {
      navigationRef.current?.reset({ index: 0, routes: [{ name: 'MandatoryUpdatePersonalData' }] })
    }
  }, [])

  // Background → Foreground transition handler
  useAppStateChange(
    () => {
      if (showEnableMandatoryUpdatePersonalData) navigateToMandatoryUpdate()
    },
    undefined,
    [showEnableMandatoryUpdatePersonalData, navigateToMandatoryUpdate]
  )

  // Cold start handler
  useEffect(() => {
    if (showEnableMandatoryUpdatePersonalData) navigateToMandatoryUpdate()
  }, [showEnableMandatoryUpdatePersonalData, navigateToMandatoryUpdate])
}
