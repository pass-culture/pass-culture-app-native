import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { SubscriptionStackParamList } from 'features/navigation/SubscriptionStackNavigator/SubscriptionStackTypes'

export const SubscriptionStackNavigatorBase =
  createNativeStackNavigator<SubscriptionStackParamList>()
