import { createStackNavigator } from '@react-navigation/stack'

import { RootStackParamList } from './types'

export const RootStackNavigatorBase = createStackNavigator<RootStackParamList>()
