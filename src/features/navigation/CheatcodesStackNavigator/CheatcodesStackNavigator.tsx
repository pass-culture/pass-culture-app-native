import { createComponentForStaticNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { cheatcodesStackNavigatorPathConfig } from 'features/navigation/CheatcodesStackNavigator/cheatcodesStackNavigatorPathConfig'

export const CheatcodesStackNavigator = createNativeStackNavigator(
  cheatcodesStackNavigatorPathConfig
)

const CheatcodesScreen = createComponentForStaticNavigation(CheatcodesStackNavigator, 'Cheatcodes')

export default CheatcodesScreen
