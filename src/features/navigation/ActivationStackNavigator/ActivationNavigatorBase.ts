import { createStackNavigator } from '@react-navigation/stack'

import { ActivationStackParamList } from 'features/navigation/ActivationStackNavigator/ActivationStackTypes'

export const ActivationNavigatorBase = createStackNavigator<ActivationStackParamList>()
