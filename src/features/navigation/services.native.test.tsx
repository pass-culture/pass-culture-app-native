import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'

import { analytics } from 'libs/analytics/provider'
import { act, render } from 'tests/utils'

import { onNavigationStateChange } from './services'

jest.unmock('@react-navigation/native')
jest.unmock('@react-navigation/native-stack')
jest.unmock('@react-navigation/bottom-tabs')

jest.mock('react-native-safe-area-context', () => ({
  ...jest.requireActual('react-native-safe-area-context'),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('onNavigationStateChange()', () => {
  it('should log screen view on navigation change', async () => {
    navigationRender()

    await simulateNavigate('Screen2')

    expect(analytics.logScreenView).toHaveBeenNthCalledWith(1, 'Screen2')

    await simulateNavigate('Screen1')

    expect(analytics.logScreenView).toHaveBeenNthCalledWith(2, 'Screen1')
  })

  it('should log screen name when navigating to a nested stack navigator', async () => {
    navigationRender()

    await simulateNavigate('NestedStackNavigator', { screen: 'Screen3' })

    expect(analytics.logScreenView).toHaveBeenNthCalledWith(1, 'Screen3')

    await simulateNavigate('NestedStackNavigator', { screen: 'Screen4' })

    expect(analytics.logScreenView).toHaveBeenNthCalledWith(2, 'Screen4')
    expect(analytics.logScreenView).toHaveBeenNthCalledWith(3, 'Screen4')

    await simulateNavigate('NestedStackNavigator', {
      screen: 'NestedTabNavigator',
      params: {
        screen: 'Screen5',
      },
    })

    expect(analytics.logScreenView).toHaveBeenNthCalledWith(4, 'Screen5')
    expect(analytics.logScreenView).toHaveBeenNthCalledWith(5, 'Screen5')

    await simulateNavigate('NestedStackNavigator', {
      screen: 'NestedTabNavigator',
      params: {
        screen: 'Screen6',
      },
    })

    expect(analytics.logScreenView).toHaveBeenNthCalledWith(6, 'Screen6')
    expect(analytics.logScreenView).toHaveBeenNthCalledWith(7, 'Screen6')
  })
})

type StackParamList = {
  Screen1: undefined
  Screen2: undefined
  NestedStackNavigator: {
    screen: keyof StackParamList2
    params?: StackParamList2[keyof StackParamList2]
  }
}
type StackParamList2 = {
  Screen3: undefined
  Screen4: undefined
  NestedTabNavigator: {
    screen: keyof TabParamList
    params?: TabParamList[keyof TabParamList]
  }
}
type TabParamList = {
  Screen5: undefined
  Screen6: undefined
}
const Stack = createNativeStackNavigator<StackParamList>()
const Stack2 = createNativeStackNavigator<StackParamList2>()
const TabNavigator = createBottomTabNavigator<TabParamList>()

const navigationRef = createNavigationContainerRef<StackParamList>()

const NestedTabNavigator = () => (
  <TabNavigator.Navigator initialRouteName="Screen5">
    <TabNavigator.Screen name="Screen5" component={Screen} />
    <TabNavigator.Screen name="Screen6" component={Screen} />
  </TabNavigator.Navigator>
)
const NestedStackNavigator = () => (
  <Stack2.Navigator initialRouteName="Screen3">
    <Stack2.Screen name="Screen3" component={Screen} />
    <Stack2.Screen name="Screen4" component={Screen} />
    <Stack2.Screen name="NestedTabNavigator" component={NestedTabNavigator} />
  </Stack2.Navigator>
)
function navigationRender() {
  return render(
    <NavigationContainer ref={navigationRef} onStateChange={onNavigationStateChange}>
      <Stack.Navigator initialRouteName="Screen1">
        <Stack.Screen name="Screen1" component={Screen} />
        <Stack.Screen name="Screen2" component={Screen} />
        <Stack.Screen name="NestedStackNavigator" component={NestedStackNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function Screen() {
  return null
}

async function simulateNavigate<RouteName extends keyof StackParamList>(
  ...args: undefined extends StackParamList[RouteName]
    ? [RouteName] | [RouteName, StackParamList[RouteName]]
    : [RouteName, StackParamList[RouteName]]
) {
  await act(async () => {
    navigationRef.navigate(...args)
  })
}
