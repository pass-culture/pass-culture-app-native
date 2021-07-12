import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'

import { initialRouteName, routes } from 'features/navigation/TabBar/routes'
import { TabBar } from 'features/navigation/TabBar/TabBar'

export const { Navigator, Screen } = createBottomTabNavigator()

export const TabNavigator: React.FC = () => {
  return (
    <Navigator
      initialRouteName={initialRouteName}
      tabBar={({ state, navigation }) => <TabBar state={state} navigation={navigation} />}>
      {routes.map((route) => (
        <Screen name={route.name} key={route.name} component={route.component} />
      ))}
    </Navigator>
  )
}
