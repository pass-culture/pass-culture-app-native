import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/firebase/analytics'
import { render, fireEvent } from 'tests/utils'

import { LoggedOutHeader } from './LoggedOutHeader'

describe('LoggedOutHeader', () => {
  it('should navigate to the SignupForm page', async () => {
    const { getByText } = render(<LoggedOutHeader />)

    const signupButton = getByText('Créer un compte')
    await fireEvent.press(signupButton)

    expect(analytics.logProfilSignUp).toBeCalled()
    expect(navigate).toBeCalledWith('SignupForm', { preventCancellation: true })
  })

  it('should navigate to the login page', async () => {
    const { getByText } = render(<LoggedOutHeader />)

    const connectButton = getByText('Se connecter')
    await fireEvent.press(connectButton)

    expect(navigate).toBeCalledWith('Login', { preventCancellation: true })
  })
})
