import { useNavigation } from '@react-navigation/native'

import { useAppSettings } from 'features/auth/settings'
import { UseNavigationType } from 'features/navigation/RootNavigator'

export const useNavigateToIdCheck = ({
  onIdCheckNavigationBlocked,
}: {
  onIdCheckNavigationBlocked: () => void
}) => {
  const { data: settings } = useAppSettings()
  const { navigate } = useNavigation<UseNavigationType>()

  return (email: string, licenceToken: string) => {
    if (settings?.allowIdCheckRegistration) {
      navigate('IdCheck', { email, licenceToken })
    } else {
      onIdCheckNavigationBlocked()
    }
  }
}
