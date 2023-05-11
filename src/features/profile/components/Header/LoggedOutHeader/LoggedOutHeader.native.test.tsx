import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/analytics'
import { render, fireEvent } from 'tests/utils'

import { LoggedOutHeader } from './LoggedOutHeader'

describe('LoggedOutHeader', () => {
  it('should navigate to the SignupForm page', async () => {
    const { getByText } = render(<LoggedOutHeader />)

    const signupButton = getByText('Créer un compte')
    await fireEvent.press(signupButton)

    expect(navigate).toBeCalledWith('SignupForm', { preventCancellation: true })
  })

  it('should log analytics when clicking on "Créer un compte"', async () => {
    const { getByText } = render(<LoggedOutHeader />)

    const signupButton = getByText('Créer un compte')
    await fireEvent.press(signupButton)

    expect(analytics.logProfilSignUp).toHaveBeenCalledTimes(1)
    expect(analytics.logSignUpClicked).toHaveBeenNthCalledWith(1, { from: 'profile' })
  })
})
