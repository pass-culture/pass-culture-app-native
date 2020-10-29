import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { act, render } from '@testing-library/react-native'
import React from 'react'

import { analytics } from 'libs/analytics'
import { flushAllPromises } from 'tests/utils'

import { onNavigationStateChange } from './services'

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))

beforeEach(() => {
  jest.resetAllMocks()
})

describe('onNavigationStateChange()', () => {
  it('should log screen view on navigation change', async () => {
    navigationRender()

    await act(async () => {
      navigate('Screen2')
      await flushAllPromises()
    })

    expect(analytics.logScreenView).toBeCalledTimes(1)
    expect(analytics.logScreenView).toBeCalledWith({ screen_name: 'Screen2' })

    await act(async () => {
      navigate('Screen1')
      await flushAllPromises()
    })

    expect(analytics.logScreenView).toBeCalledTimes(2)
    expect(analytics.logScreenView).toBeCalledWith({ screen_name: 'Screen1' })
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
