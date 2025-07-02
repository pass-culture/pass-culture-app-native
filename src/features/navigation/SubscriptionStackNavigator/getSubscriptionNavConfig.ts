import {
  SubscriptionStackParamList,
  SubscriptionStackRouteName,
} from 'features/navigation/SubscriptionStackNavigator/SubscriptionStackTypes'

export function getSubscriptionNavConfig<Screen extends SubscriptionStackRouteName>(
  screen: Screen,
  params?: SubscriptionStackParamList[Screen]
): {
  screen: 'SubscriptionStackNavigator'
  params?: {
    screen: Screen
    params?: SubscriptionStackParamList[Screen]
  }
} {
  return {
    screen: 'SubscriptionStackNavigator',
    params: { screen, params },
  }
}
