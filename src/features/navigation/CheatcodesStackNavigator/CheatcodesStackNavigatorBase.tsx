import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { CheatcodesStackParamList } from 'features/navigation/CheatcodesStackNavigator/CheatcodesStackTypes'

export const CheatcodesStackNavigatorBase = createNativeStackNavigator<CheatcodesStackParamList>()
