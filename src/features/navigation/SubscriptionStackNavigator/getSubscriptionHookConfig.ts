import {
  SubscriptionStackParamList,
  SubscriptionStackRouteName,
} from 'features/navigation/SubscriptionStackNavigator/SubscriptionStackTypes'

/**
 * The returned object can be passed to "navigate" of useNavigation (react-navigation/native)
 */
export function getSubscriptionHookConfig<Screen extends SubscriptionStackRouteName>(
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
