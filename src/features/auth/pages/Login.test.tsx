import { NavigationContainer } from '@react-navigation/native' // @react-navigation
import { createStackNavigator } from '@react-navigation/stack' // @react-navigation
import { render, fireEvent, waitFor, act } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import * as api from '../api'

import { Login } from './Login'

const Home = () => <Text>Home message</Text>

const RootStack = createStackNavigator()

describe('<Login/>', () => {
  it('should redirect to home page when signin is successful', async () => {
    jest.spyOn(api, 'signin').mockImplementation(signingSuccess)
    const { getByText, queryByText } = render(
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="Login">
          <RootStack.Screen name="Home" component={Home} />
          <RootStack.Screen name="Login" component={Login} />
        </RootStack.Navigator>
      </NavigationContainer>
    )

    fireEvent.press(getByText('Connexion'))

    await act(async () => {
      const HomeMessage = await waitFor(() => queryByText('Home message'))
      expect(HomeMessage).toBeTruthy()
    })
  })

  it('should NOT redirect to home page when signin has failed', async () => {
    jest.spyOn(api, 'signin').mockImplementation(signingFailure)
    const { getByText, queryByText } = render(
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="Login">
          <RootStack.Screen name="Home" component={Home} />
          <RootStack.Screen name="Login" component={Login} />
        </RootStack.Navigator>
      </NavigationContainer>
    )

    fireEvent.press(getByText('Connexion'))

    await act(async () => {
      const HomeMessage = await waitFor(() => queryByText('Home message'))
      expect(HomeMessage).toBeNull()
    })
  })
})

async function signingSuccess() {
  return true
}

async function signingFailure() {
  return false
}
