import { useNavigation } from '@react-navigation/native'
import { useEffect, useCallback } from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useAppStateChange } from 'libs/appState'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'

export function useShowMandatoryUpdatePersonalData() {
  const { reset } = useNavigation<UseNavigationType>()
  const { isLoggedIn, user } = useAuthContext()
  const { data } = useRemoteConfigQuery()
  const displayMandatoryUpdatePersonalData = data?.displayMandatoryUpdatePersonalData
  const enableMandatoryUpdatePersonalData = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_MANDATORY_UPDATE_PERSONAL_DATA
  )

  const showEnableMandatoryUpdatePersonalData =
    user && isLoggedIn && enableMandatoryUpdatePersonalData && displayMandatoryUpdatePersonalData

  const navigateToMandatoryUpdate = useCallback(() => {
    reset({ index: 0, routes: [{ name: 'MandatoryUpdatePersonalData' }] })
  }, [reset])

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
