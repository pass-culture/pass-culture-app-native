import { useNavigation } from '@react-navigation/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'

export const useNavigateToIdCheck = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  return (email: string, licenceToken: string) => {
    navigate('IdCheck', { email, licenceToken })
  }
}
