import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { CheatcodesStackParamList } from 'features/navigation/CheatcodesStackNavigator/types'

export const CheatcodesStackNavigatorBase = createNativeStackNavigator<CheatcodesStackParamList>()
