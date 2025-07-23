import { createStackNavigator } from '@react-navigation/stack'

import { SubscriptionStackParamList } from 'features/navigation/SubscriptionStackNavigator/SubscriptionStackTypes'

export const SubscriptionStackNavigatorBase = createStackNavigator<SubscriptionStackParamList>()
