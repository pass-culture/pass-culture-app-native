import { NavigationContainer } from '@react-navigation/native' // @react-navigation
import { createStackNavigator } from '@react-navigation/stack' // @react-navigation
import { render, fireEvent } from '@testing-library/react-native'
import { rest } from 'msw'
import React from 'react'

import { Home } from 'features/home/pages/Home'
import { env } from 'libs/environment'
import { server } from 'tests/server'

import { Login } from './Login'

const RootStack = createStackNavigator()
jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))

beforeEach(() => jest.useFakeTimers())

describe('<Login/>', () => {
  it('should redirect to home page when signin is successful', async () => {
    const { getByText, findByText } = render(
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="Login">
          <RootStack.Screen name="Home" component={Home} />
          <RootStack.Screen name="Login" component={Login} />
        </RootStack.Navigator>
      </NavigationContainer>
    )

    const connexionButton = getByText('Connexion')
    fireEvent.press(connexionButton)

    const welcomeMessage = findByText('Bienvenue à Pass Culture')
    expect(welcomeMessage).toBeTruthy()
  })

  it('should NOT redirect to home page when signin has failed', async () => {
    server.use(
      rest.post(env.API_BASE_URL + '/users/signin', async (req, res, ctx) => {
        return res(ctx.status(401))
      })
    )
    const { getByText, findByText } = render(
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="Login">
          <RootStack.Screen name="Home" component={Home} />
          <RootStack.Screen name="Login" component={Login} />
        </RootStack.Navigator>
      </NavigationContainer>
    )
    const connexionButton = getByText('Connexion')
    fireEvent.press(connexionButton)

    const failureMessage = findByText('Échec de la connexion au Pass Culture')
    expect(failureMessage).toBeTruthy()
  })
})
