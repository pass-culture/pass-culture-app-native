import { initialRouteName as idCheckInitialRouteName } from '@pass-culture/id-check'
import { useNavigation } from '@react-navigation/native'

import { useAppSettings } from 'features/auth/settings'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'

type Params = {
  onIdCheckNavigationBlocked?: () => void
  shouldControlNavWithSetting?: boolean
}

const defaultParams = {
  onIdCheckNavigationBlocked: navigateToHome,
  shouldControlNavWithSetting: true,
}

export function useNavigateToIdCheck({
  onIdCheckNavigationBlocked = defaultParams.onIdCheckNavigationBlocked,
  shouldControlNavWithSetting = defaultParams.shouldControlNavWithSetting,
}: Params = defaultParams) {
  const { data: settings } = useAppSettings()
  const { navigate } = useNavigation<UseNavigationType>()
  function navigateToIdCheck() {
    const shouldNavigateToIdCheck =
      !shouldControlNavWithSetting || settings?.allowIdCheckRegistration
    if (shouldNavigateToIdCheck) {
      navigate(idCheckInitialRouteName)
    } else {
      onIdCheckNavigationBlocked()
    }
  }
  return navigateToIdCheck
}
