import React from 'react'

import { navigate, reset } from '__mocks__/@react-navigation/native'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { userEvent, render, screen } from 'tests/utils'

import { OnboardingGeneralPublicWelcome } from './OnboardingGeneralPublicWelcome'

jest.useFakeTimers()

describe('OnboardingGeneralPublicWelcome', () => {
  it('should render correctly', () => {
    render(<OnboardingGeneralPublicWelcome />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to SignupForm when pressing "Créer un compte"', async () => {
    render(<OnboardingGeneralPublicWelcome />)

    const signupButton = screen.getByText('Créer un compte')
    await userEvent.press(signupButton)

    expect(navigate).toHaveBeenCalledWith('SignupForm', {
      from: StepperOrigin.ONBOARDING_GENERAL_PUBLIC_WELCOME,
    })
  })

  it('should reset navigation on go to Home when pressing "Accéder au catalogue"', async () => {
    render(<OnboardingGeneralPublicWelcome />)

    const signupButton = screen.getByText('Accéder au catalogue')
    await userEvent.press(signupButton)

    expect(reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: homeNavConfig[0] }],
    })
  })

  it('should reset navigation on go to Home when pressing "Plus tard"', async () => {
    render(<OnboardingGeneralPublicWelcome />)

    const signupButton = screen.getByText('Passer')
    await userEvent.press(signupButton)

    expect(reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: homeNavConfig[0] }],
    })
  })
})
