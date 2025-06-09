import { createStackNavigator } from '@react-navigation/stack'

import { RootStackParamList } from 'features/navigation/RootNavigator/types'

export const RootStackNavigatorBase = createStackNavigator<RootStackParamList>()
