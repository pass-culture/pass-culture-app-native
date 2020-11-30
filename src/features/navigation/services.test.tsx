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
  it('should log screen view on navigation change', async () => {
    navigationRender()

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
  })
})

type StackParamList = {
  Screen1: undefined
  Screen2: undefined
}

const Stack = createStackNavigator<StackParamList>()

const navigationRef = React.createRef<NavigationContainerRef>()

function navigate(name: string) {
  navigationRef.current?.navigate(name)
}

function navigationRender() {
  return render(
    <NavigationContainer ref={navigationRef} onStateChange={onNavigationStateChange}>
      <Stack.Navigator initialRouteName="Screen1">
        <Stack.Screen name="Screen1" component={Screen} />
        <Stack.Screen name="Screen2" component={Screen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function Screen() {
  return null
}
