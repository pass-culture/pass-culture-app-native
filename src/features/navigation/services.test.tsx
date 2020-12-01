import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { NavigationState } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { act, render } from '@testing-library/react-native'
import React from 'react'

import { analytics } from 'libs/analytics'
import { flushAllPromises } from 'tests/utils'

import { state1, state2, state3 } from './navigationStateSnapshots'
import { getScreenName, onNavigationStateChange } from './services'

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))

describe('getScreenName', () => {
  it.each`
    stateName   | state     | screenName
    ${'state1'} | ${state1} | ${'Search'}
    ${'state2'} | ${state2} | ${'Login'}
    ${'state3'} | ${state3} | ${'Home'}
  `(
    'getScreenName($stateName) should be $screenName',
    ({ state, screenName }: { state: NavigationState; screenName: string }) => {
      expect(getScreenName(state)).toEqual(screenName)
    }
  )
})
describe('onNavigationStateChange()', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should log screen view on navigation change', async () => {
    const { unmount } = navigationRender()

    await act(async () => {
      navigate('Screen2')
      await flushAllPromises()
    })

    expect(analytics.logScreenView).toBeCalledTimes(1)
    expect(analytics.logScreenView).toHaveBeenCalledWith({ screen_name: 'Screen2' })

    await act(async () => {
      navigate('Screen1')
      await flushAllPromises()
    })

    expect(analytics.logScreenView).toBeCalledTimes(2)
    expect(analytics.logScreenView).toHaveBeenCalledWith({ screen_name: 'Screen1' })
    unmount()
  })
  it('should log screen name when navigating to a nested stack navigator', async () => {
    const { unmount } = navigationRender()

    await act(async () => {
      navigate('NestedStackNavigator')
      await flushAllPromises()
    })

    expect(analytics.logScreenView).toBeCalledTimes(1)
    expect(analytics.logScreenView).toHaveBeenCalledWith({ screen_name: 'Screen3' })

    await act(async () => {
      navigate('Screen4')
      await flushAllPromises()
    })

    expect(analytics.logScreenView).toBeCalledTimes(2)
    expect(analytics.logScreenView).toHaveBeenCalledWith({ screen_name: 'Screen4' })

    await act(async () => {
      navigate('NestedTabNavigator')
      await flushAllPromises()
    })

    expect(analytics.logScreenView).toBeCalledTimes(3)
    expect(analytics.logScreenView).toHaveBeenCalledWith({ screen_name: 'Screen5' })

    await act(async () => {
      navigate('Screen6')
      await flushAllPromises()
    })

    expect(analytics.logScreenView).toBeCalledTimes(4)
    expect(analytics.logScreenView).toHaveBeenCalledWith({ screen_name: 'Screen6' })

    unmount()
  })
})

type StackParamList = {
  Screen1: undefined
  Screen2: undefined
  NestedStackNavigator: undefined
}
type StackParamList2 = {
  Screen3: undefined
  Screen4: undefined
  NestedTabNavigator: undefined
}
type TabParamList = {
  Screen5: undefined
  Screen6: undefined
}
const Stack = createStackNavigator<StackParamList>()
const Stack2 = createStackNavigator<StackParamList2>()
const TabNavigator = createBottomTabNavigator<TabParamList>()

const navigationRef = React.createRef<NavigationContainerRef>()

function navigate(name: string) {
  navigationRef.current?.navigate(name)
}
const NestedTabNavigator = () => (
  <TabNavigator.Navigator>
    <TabNavigator.Screen name="Screen5" component={Screen} />
    <TabNavigator.Screen name="Screen6" component={Screen} />
  </TabNavigator.Navigator>
)
const NestedStackNavigator = () => (
  <Stack2.Navigator>
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
