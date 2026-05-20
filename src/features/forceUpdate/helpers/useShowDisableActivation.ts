import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'

import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { getSubscriptionHookConfig } from 'features/navigation/navigators/SubscriptionStackNavigator/getSubscriptionHookConfig'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'

export const useShowDisableActivation = () => {
  const disableAction = useFeatureFlag(RemoteStoreFeatureFlags.DISABLE_ACTIVATION)
  const navigation = useNavigation<UseNavigationType>()

  useEffect(() => {
    if (disableAction) navigation.replace(...getSubscriptionHookConfig('DisableActivation'))
  }, [disableAction, navigation])
}
