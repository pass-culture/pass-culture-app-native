import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { ProfileStackParamList } from './ProfileStackTypes'

export const ProfileStackNavigatorBase = createNativeStackNavigator<ProfileStackParamList>()
