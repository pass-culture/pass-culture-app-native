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
    expirationTimestamp?: Date | number | null
  ) {
    const shouldNavigateToIdCheck =
      !shouldControlNavWithSetting || settings?.allowIdCheckRegistration
    if (shouldNavigateToIdCheck) {
      if (settings?.enableNativeIdCheckVersion) {
        navigate(idCheckInitialRouteName, {
          email,
          licence_token: licenceToken,
          expiration_timestamp:
            expirationTimestamp instanceof Date
              ? expirationTimestamp.getTime()
              : expirationTimestamp,
        })
      } else {
        navigate('IdCheck', {
          email,
          licence_token: licenceToken,
          expiration_timestamp:
            expirationTimestamp instanceof Date
              ? expirationTimestamp.getTime()
              : expirationTimestamp,
        })
      }
    } else {
      onIdCheckNavigationBlocked()
    }
  }

  return navigateToIdCheck
}
