import { render } from '@testing-library/react-native'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'

import { LoggedOutHeader } from './LoggedOutHeader'

describe('LoggedOutHeader', () => {
  it('should navigate to the setEmail page', () => {
    const { getByTestId } = render(<LoggedOutHeader />)

    const signupButton = getByTestId('button-container')
    signupButton.props.onClick()

    expect(navigate).toBeCalledWith('SetEmail')
  })
  it('should navigate to the login page', () => {
    const { getByTestId } = render(<LoggedOutHeader />)

    const connectButton = getByTestId('login-button')
    connectButton.props.onClick()

    expect(navigate).toBeCalledWith('Login')
  })
})
