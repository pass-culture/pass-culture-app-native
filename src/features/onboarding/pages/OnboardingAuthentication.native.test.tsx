import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { OnboardingAuthentication } from 'features/onboarding/pages/OnboardingAuthentication'
import { fireEvent, render, waitFor } from 'tests/utils'

describe('OnboardingAuthentication', () => {
  it('should render correctly', () => {
    const renderAPI = render(<OnboardingAuthentication />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should redirect to signup when signup button is clicked', async () => {
    const { getByText } = render(<OnboardingAuthentication />)

    const signupButton = getByText('Créer un compte')
    fireEvent.press(signupButton)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('SignupForm', { preventCancellation: true })
    })
  })

  it('should redirect to home when skip button is clicked', async () => {
    const { getByText } = render(<OnboardingAuthentication />)

    const skipButton = getByText('Plus tard')
    fireEvent.press(skipButton)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(...homeNavConfig)
    })
  })
})
