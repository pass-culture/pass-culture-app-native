import { useNavigation } from '@react-navigation/native'

import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'

export const useNavigateToHomeWithReset = () => {
  const { reset } = useNavigation<UseNavigationType>()
  const navigateToHomeWithReset = () => {
    reset({ index: 0, routes: [{ name: homeNavConfig[0] }] })
  }
  return { navigateToHomeWithReset }
}
