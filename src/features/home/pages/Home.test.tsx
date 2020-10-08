import { render, fireEvent } from '@testing-library/react-native'
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

  it('should render correctly', () => {
    const home = render(<Home navigation={navigation} />)
    expect(home).toMatchSnapshot()
  })

  it('should have a button to go to login page', () => {
    const { getByText } = render(<Home navigation={navigation} />)
    const LoginButton = getByText('Aller sur la page de connexion')
    fireEvent.press(LoginButton)
    expect(navigation.navigate).toHaveBeenCalledWith('Login')
  })

  it('should have a button to go to login page with params', () => {
    const { getByText } = render(<Home navigation={navigation} />)
    const LoginButton = getByText('Aller sur la page de connexion avec params')
    fireEvent.press(LoginButton)
    expect(navigation.navigate).toHaveBeenCalledWith('Login', {
      userId: 'I have been Set by params',
    })
  })

  it('should nothave code push button', async () => {
    env.FEATURE_FLAG_CODE_PUSH = false
    const home = render(<Home navigation={navigation} />)
    expect(() => home.getByText('Check update')).toThrowError()
  })
})
