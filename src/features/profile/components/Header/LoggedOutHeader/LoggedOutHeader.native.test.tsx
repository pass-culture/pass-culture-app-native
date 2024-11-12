import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics'
import { render, fireEvent, screen } from 'tests/utils'

import { LoggedOutHeader } from './LoggedOutHeader'

describe('LoggedOutHeader', () => {
  it('should navigate to the SignupForm page', async () => {
    render(<LoggedOutHeader />)

    const signupButton = screen.getByText('Créer un compte')
    await fireEvent.press(signupButton)

    expect(navigate).toHaveBeenCalledWith('SignupForm', {
      from: StepperOrigin.PROFILE,
    })
  })

  it('should navigate to the Login page', () => {
    render(<LoggedOutHeader />)

    const signinButton = screen.getByText('Se connecter')
    fireEvent.press(signinButton)

    expect(navigate).toHaveBeenCalledWith('Login', {
      from: StepperOrigin.PROFILE,
    })
  })

  it('should log analytics when clicking on "Créer un compte"', async () => {
    render(<LoggedOutHeader />)

    const signupButton = screen.getByText('Créer un compte')
    await fireEvent.press(signupButton)

    expect(analytics.logProfilSignUp).toHaveBeenCalledTimes(1)
    expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, { from: 'profile' })
  })
})
