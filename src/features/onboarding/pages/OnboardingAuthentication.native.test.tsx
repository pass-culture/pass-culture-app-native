import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { OnboardingAuthentication } from 'features/onboarding/pages/OnboardingAuthentication'
import { fireEvent, render, waitFor } from 'tests/utils'

describe('OnboardingAuthentication', () => {
  it('should render correctly', () => {
    const renderAPI = render(<OnboardingAuthentication />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should redirect to AgeSelection when "C’est parti !" is clicked', async () => {
    const { getByText } = render(<OnboardingAuthentication />)

    const button = getByText('C’est parti\u00a0!')
    fireEvent.press(button)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('AgeSelection', undefined)
    })
  })

  it('should redirect to login when "Se connecter" is clicked', async () => {
    const { getByText } = render(<OnboardingAuthentication />)

    const loginButton = getByText('Se connecter')
    fireEvent.press(loginButton)

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('Login', { preventCancellation: true })
    })
  })
})
