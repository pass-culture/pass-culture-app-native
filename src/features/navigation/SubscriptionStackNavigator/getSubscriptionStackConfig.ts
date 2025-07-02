import {
  SubscriptionStackParamList,
  SubscriptionStackRouteName,
} from 'features/navigation/SubscriptionStackNavigator/SubscriptionStackTypes'

export function getSubscriptionStackConfig<Screen extends SubscriptionStackRouteName>(
  screen: Screen,
  params?: SubscriptionStackParamList[Screen]
): [
  'SubscriptionStackNavigator',
  {
    screen: Screen
    params?: SubscriptionStackParamList[Screen]
  },
] {
  return ['SubscriptionStackNavigator', { screen, params }]
}
