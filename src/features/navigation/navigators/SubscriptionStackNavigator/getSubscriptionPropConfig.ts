import {
  SubscriptionStackParamList,
  SubscriptionStackRouteName,
} from 'features/navigation/navigators/SubscriptionStackNavigator/types'

type SubscriptionPropNavigationConfig<Screen extends SubscriptionStackRouteName> = {
  screen: 'SubscriptionStackNavigator'
  params?: {
    screen: Screen
    params?: SubscriptionStackParamList[Screen]
  }
}
export const getSubscriptionPropConfig = <Screen extends SubscriptionStackRouteName>(
  screen: Screen,
  params?: SubscriptionStackParamList[Screen]
): SubscriptionPropNavigationConfig<Screen> => ({
  screen: 'SubscriptionStackNavigator',
  params: { screen, params },
})
