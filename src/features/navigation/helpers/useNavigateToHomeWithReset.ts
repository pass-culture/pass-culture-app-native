import { useNavigation } from '@react-navigation/native'

import { UseNavigationType } from 'features/navigation/navigators/RootNavigator/types'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'

export const useNavigateToHomeWithReset = () => {
  const { reset } = useNavigation<UseNavigationType>()
  const navigateToHomeWithReset = () => {
    reset({ index: 0, routes: [{ name: homeNavigationConfig[0] }] })
  }
  return { navigateToHomeWithReset }
}
