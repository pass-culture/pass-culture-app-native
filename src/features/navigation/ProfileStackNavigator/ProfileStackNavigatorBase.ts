import { createStackNavigator } from '@react-navigation/stack'

import { ProfileStackParamList } from './ProfileStackTypes'

export const ProfileStackNavigatorBase = createStackNavigator<ProfileStackParamList>()
