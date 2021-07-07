import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { Text } from 'react-native'
import styled from 'styled-components/native'

import { TabBar } from 'features/navigation/TabBar/TabBar'

export const { Navigator, Screen } = createBottomTabNavigator()

const Page = styled.View({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
})
const Page2 = () => (
  <Page>
    <Text>Page 2</Text>
  </Page>
)
const Page3 = () => (
  <Page>
    <Text>Page 3</Text>
  </Page>
)

export const tabBarRoutes = [
  {
    name: 'Page2',
    component: Page2,
  },
  {
    name: 'Page3',
    component: Page3,
  },
]

export const TabNavigator: React.FC = () => {
  return (
    <Navigator
      initialRouteName="Page2"
      tabBar={({ state, navigation }) => <TabBar state={state} navigation={navigation} />}>
      {tabBarRoutes.map((route) => (
        <Screen name={route.name} key={route.name} component={route.component} />
      ))}
    </Navigator>
  )
}
