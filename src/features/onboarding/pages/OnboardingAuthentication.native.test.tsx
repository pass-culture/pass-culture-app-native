import React from 'react'

import { navigate, reset } from '__mocks__/@react-navigation/native'
import { OnboardingAuthentication } from 'features/onboarding/pages/OnboardingAuthentication'
import { fireEvent, render, waitFor } from 'tests/utils'

describe('OnboardingAuthentication', () => {
  it('should render correctly', () => {
    const renderAPI = render(<OnboardingAuthentication />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should reset navigation and redirect to signup when signup button is clicked', async () => {
    const { getByText } = render(<OnboardingAuthentication />)

    const signupButton = getByText('Créer un compte')
    fireEvent.press(signupButton)

    await waitFor(() => {
      expect(reset).toHaveBeenCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith('SignupForm', { preventCancellation: true })
    })
  })

  it('should reset navigation and redirect to signup when signin button is clicked', async () => {
    const { getByText } = render(<OnboardingAuthentication />)

    const signinButton = getByText('Se connecter')
    fireEvent.press(signinButton)

    await waitFor(() => {
      expect(reset).toHaveBeenCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith('Login', { preventCancellation: true })
    })
  })
})
