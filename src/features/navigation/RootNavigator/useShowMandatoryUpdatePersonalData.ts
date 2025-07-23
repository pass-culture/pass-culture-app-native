import { useNavigation } from '@react-navigation/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { useAppStateChange } from 'libs/appState'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'

export function useShowMandatoryUpdatePersonalData() {
  const { reset } = useNavigation<UseNavigationType>()
  const { isLoggedIn, user } = useAuthContext()
  const { displayMandatoryUpdatePersonalData } = useRemoteConfigQuery()
  const enableMandatoryUpdatePersonalData = useFeatureFlag(
    RemoteStoreFeatureFlags.ENABLE_MANDATORY_UPDATE_PERSONAL_DATA
  )

  const showEnableMandatoryUpdatePersonalData =
    user && isLoggedIn && enableMandatoryUpdatePersonalData && displayMandatoryUpdatePersonalData

  useAppStateChange(
    () => {
      if (showEnableMandatoryUpdatePersonalData) {
        reset({ index: 0, routes: [{ name: 'MandatoryUpdatePersonalData' }] })
      }
    },
    undefined,
    [showEnableMandatoryUpdatePersonalData]
  )
}
