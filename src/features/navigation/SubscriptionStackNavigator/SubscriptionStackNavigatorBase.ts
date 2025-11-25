import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { SubscriptionStackParamList } from 'features/navigation/SubscriptionStackNavigator/types'

export const SubscriptionStackNavigatorBase =
  createNativeStackNavigator<SubscriptionStackParamList>()
