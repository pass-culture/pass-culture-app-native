import { NavigationContainer } from '@react-navigation/native'
import { render, waitFor, act } from '@testing-library/react-native'
import React from 'react'

import { HomeStack } from 'features/home/navigation/HomeNavigator'
import { env } from 'libs/environment'
import { flushAllPromises } from 'tests/utils'

import { HomeComponent } from './Home'

jest.mock('@react-navigation/native', () => jest.requireActual('@react-navigation/native'))

jest.mock('libs/environment', () => ({
  env: {
    FEATURE_FLAG_CODE_PUSH: true,
    CHEAT_BUTTONS_ENABLED: false,
  },
}))

jest.mock('features/auth/api', () => ({ useIsLoggedIn: jest.fn(() => ({ data: false })) }))

describe('Home component', () => {
  it('should render correctly without login modal', async () => {
    const home = await renderHomeWithoutLoginModal()

    expect(home).toMatchSnapshot()
  })

  it('should render modal correctly', async () => {
    const homeWithLoginModal = await renderHomeWithLoginModal()
    const homeWithoutLoginModal = await renderHomeWithoutLoginModal()

    expect(homeWithoutLoginModal).toMatchDiffSnapshot(homeWithLoginModal)
  })

  it('should have a welcome message', async () => {
    const { getByText } = await renderHomeWithoutLoginModal()

    const welcomeText = await waitFor(() => getByText('Bienvenue !'))
    expect(welcomeText.props.children).toBe('Bienvenue !')
  })

  it('should not have code push button', async () => {
    env.FEATURE_FLAG_CODE_PUSH_MANUAL = false
    const home = await renderHomeWithoutLoginModal()

    expect(() => home.getByText('Check update')).toThrowError()
  })

  it('should have components and navigation buttons when CHEAT_BUTTONS_ENABLED', async () => {
    env.CHEAT_BUTTONS_ENABLED = true
    const home = await renderHomeWithoutLoginModal()

    expect(() => home.getByText('Composants')).toBeTruthy()
    expect(() => home.getByText('Navigation')).toBeTruthy()
  })

  it('should NOT have components or navigation buttons when NOT CHEAT_BUTTONS_ENABLED', async () => {
    env.CHEAT_BUTTONS_ENABLED = false
    const home = await renderHomeWithoutLoginModal()

    expect(() => home.getByText('Composants')).toThrowError()
    expect(() => home.getByText('Navigation')).toThrowError()
  })
})

async function renderHomeWithoutLoginModal() {
  const renderAPI = render(
    <NavigationContainer>
      <HomeStack.Navigator initialRouteName="Home">
        <HomeStack.Screen
          name="Home"
          component={HomeComponent}
          initialParams={{ shouldDisplayLoginModal: false }}
        />
      </HomeStack.Navigator>
    </NavigationContainer>
  )
  await act(async () => {
    await flushAllPromises()
  })
  return renderAPI
}

async function renderHomeWithLoginModal() {
  const renderAPI = render(
    <NavigationContainer>
      <HomeStack.Navigator initialRouteName="Home">
        <HomeStack.Screen
          name="Home"
          component={HomeComponent}
          initialParams={{ shouldDisplayLoginModal: true }}
        />
      </HomeStack.Navigator>
    </NavigationContainer>
  )
  await act(async () => {
    await flushAllPromises()
  })
  return renderAPI
}
