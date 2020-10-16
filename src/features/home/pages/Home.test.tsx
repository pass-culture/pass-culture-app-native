import { render, fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'

import { env } from 'libs/environment'

import { Home } from './Home'

jest.mock('libs/environment', () => ({
  env: {
    FEATURE_FLAG_CODE_PUSH: true,
  },
}))

describe('Home component', () => {
  const navigation = {
    navigate: jest.fn(),
  } as any // eslint-disable-line @typescript-eslint/no-explicit-any

  it('should have a welcome message', async () => {
    const { getByText } = render(<Home navigation={navigation} />)

    const welcomeText = await waitFor(() => getByText('Bienvenue à Pass Culture'))
    expect(welcomeText.props.children).toBe('Bienvenue à Pass Culture')
  })

  it('should render correctly', () => {
    const home = render(<Home navigation={navigation} />)
    expect(home).toMatchSnapshot()
  })

  it('should have a button to go to login page with params', () => {
    const { getByText } = render(<Home navigation={navigation} />)
    const LoginButton = getByText('Aller sur la page de connexion avec params')
    fireEvent.press(LoginButton)
    expect(navigation.navigate).toHaveBeenCalledWith('Login', {
      userId: 'I have been Set by params',
    })
  })

  it('should not have code push button', async () => {
    env.FEATURE_FLAG_CODE_PUSH_MANUAL = false
    const home = render(<Home navigation={navigation} />)
    expect(() => home.getByText('Check update')).toThrowError()
  })
})
