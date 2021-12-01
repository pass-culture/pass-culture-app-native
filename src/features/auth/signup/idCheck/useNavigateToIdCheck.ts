import { initialRouteName as idCheckInitialRouteName } from '@pass-culture/id-check'
import { useNavigation } from '@react-navigation/native'

import { useAppSettings } from 'features/auth/settings'
import { UseNavigationType } from 'features/navigation/RootNavigator'

export function useNavigateToIdCheck() {
  const { data: settings } = useAppSettings()
  const { navigate } = useNavigation<UseNavigationType>()

  return settings?.allowIdCheckRegistration
    ? () => navigate(idCheckInitialRouteName)
    : () => navigate('IdCheckUnavailable')
}
