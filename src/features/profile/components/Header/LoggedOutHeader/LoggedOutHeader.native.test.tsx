import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/firebase/analytics'
import { render, fireEvent } from 'tests/utils'

import { LoggedOutHeader } from './LoggedOutHeader'

describe('LoggedOutHeader', () => {
  it('should navigate to the SignupForm page', async () => {
    const { getByTestId } = render(<LoggedOutHeader />)

    const signupButton = getByTestId('S’inscrire')

    await fireEvent.press(signupButton)

    expect(analytics.logProfilSignUp).toBeCalled()
    expect(navigate).toBeCalledWith('SignupForm', { preventCancellation: true })
  })
  it('should navigate to the login page', async () => {
    const { getByTestId } = render(<LoggedOutHeader />)

    const connectButton = getByTestId('Connecte-toi')
    await fireEvent.press(connectButton)

    expect(navigate).toBeCalledWith('Login', { preventCancellation: true })
  })
})
