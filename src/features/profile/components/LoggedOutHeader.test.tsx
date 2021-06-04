import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/analytics'
import { render } from 'tests/utils'

import { LoggedOutHeader } from './LoggedOutHeader'

describe('LoggedOutHeader', () => {
  it('should navigate to the setEmail page', () => {
    const { getByTestId } = render(<LoggedOutHeader />)

    const signupButton = getByTestId("S'inscrire")
    signupButton.props.onClick()

    expect(analytics.logProfilSignUp).toBeCalled()
    expect(navigate).toBeCalledWith('SetEmail', { preventCancellation: true })
  })
  it('should navigate to the login page', () => {
    const { getByTestId } = render(<LoggedOutHeader />)

    const connectButton = getByTestId('Connecte-toi')
    connectButton.props.onClick()

    expect(navigate).toBeCalledWith('Login', { preventCancellation: true })
  })
})
