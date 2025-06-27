import { StackNavigationOptions } from '@react-navigation/stack'
import React from 'react'

import { withAsyncErrorBoundary } from 'features/errors/hocs/withAsyncErrorBoundary'
import { ROOT_NAVIGATOR_SCREEN_OPTIONS } from 'features/navigation/RootNavigator/navigationOptions'
import { SubscriptionStackNavigatorBase } from 'features/navigation/SubscriptionStackNavigator/SubscriptionStackNavigatorBase'
import { SubscriptionStackRouteName } from 'features/navigation/SubscriptionStackNavigator/SubscriptionStackTypes'

type SubscriptionRouteConfig = {
  name: SubscriptionStackRouteName
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>
  options: StackNavigationOptions
}

const subscriptionScreens: SubscriptionRouteConfig[] = []

export const SubscriptionStackNavigator = () => (
  <SubscriptionStackNavigatorBase.Navigator
    initialRouteName="test"
    screenOptions={ROOT_NAVIGATOR_SCREEN_OPTIONS}>
    {subscriptionScreens.map(({ name, component, options }) => (
      <SubscriptionStackNavigatorBase.Screen
        key={name}
        name={name}
        component={withAsyncErrorBoundary(component)}
        options={options}
      />
    ))}
  </SubscriptionStackNavigatorBase.Navigator>
)
