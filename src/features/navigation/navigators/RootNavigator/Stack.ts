import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { RootStackParamList } from 'features/navigation/navigators/RootNavigator/types'

export const RootStackNavigatorBase = createNativeStackNavigator<RootStackParamList>()
