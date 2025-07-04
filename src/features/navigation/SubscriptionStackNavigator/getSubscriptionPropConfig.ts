import {
  SubscriptionStackParamList,
  SubscriptionStackRouteName,
} from 'features/navigation/SubscriptionStackNavigator/SubscriptionStackTypes'

/**
 * The returned object can be passed to "navigateTo" props of in-house components
 */
export function getSubscriptionPropConfig<Screen extends SubscriptionStackRouteName>(
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
