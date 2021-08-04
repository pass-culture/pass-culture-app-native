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
  function navigateToIdCheck(
    email: string,
    licenceToken?: string,
    expiration_timestamp?: Date | number | null
  ) {
    const shouldNavigateToIdCheck =
      !shouldControlNavWithSetting || settings?.allowIdCheckRegistration
    if (shouldNavigateToIdCheck) {
      if (settings?.enableNativeIdCheckVersion) {
        navigate(idCheckInitialRouteName, {
          email,
          licence_token: licenceToken,
          expiration_timestamp:
            expiration_timestamp instanceof Date
              ? expiration_timestamp.getTime()
              : expiration_timestamp,
        })
      } else {
        navigate('IdCheck', {
          email,
          licence_token: licenceToken,
          expiration_timestamp:
            expiration_timestamp instanceof Date
              ? expiration_timestamp.getTime()
              : expiration_timestamp,
        })
      }
    } else {
      onIdCheckNavigationBlocked()
    }
  }

  return navigateToIdCheck
}
