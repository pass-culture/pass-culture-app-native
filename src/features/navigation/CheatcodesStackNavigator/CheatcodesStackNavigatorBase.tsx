import { createStackNavigator } from '@react-navigation/stack'

import { CheatcodesStackParamList } from 'features/navigation/CheatcodesStackNavigator/CheatcodesStackTypes'

export const CheatcodesStackNavigatorBase = createStackNavigator<CheatcodesStackParamList>()
