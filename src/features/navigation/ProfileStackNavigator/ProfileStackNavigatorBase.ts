import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { ProfileStackParamList } from './types'

export const ProfileStackNavigatorBase = createNativeStackNavigator<ProfileStackParamList>()
