import React from 'react'

import { navigate, reset } from '__mocks__/@react-navigation/native'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { OnboardingNotEligible } from 'features/onboarding/pages/onboarding/OnboardingNotEligible'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.useFakeTimers()

describe('OnboardingNotEligible', () => {
  it('should render correctly', () => {
    render(<OnboardingNotEligible />)

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to SignupForm when pressing "Créer un compte"', async () => {
    render(<OnboardingNotEligible />)

    const signupButton = screen.getByText('Créer un compte')
    await userEvent.press(signupButton)

    expect(navigate).toHaveBeenCalledWith('SignupForm', {
      from: StepperOrigin.ONBOARDING_NOT_ELIGIBLE,
    })
  })

  it('should reset navigation on go to Home when pressing "Accéder au catalogue"', async () => {
    render(<OnboardingNotEligible />)

    const signupButton = screen.getByText('Accéder au catalogue')
    await userEvent.press(signupButton)

    expect(reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: homeNavConfig[0] }],
    })
  })

  it('should reset navigation on go to Home when pressing "Plus tard"', async () => {
    render(<OnboardingNotEligible />)

    const signupButton = screen.getByText('Passer')
    await userEvent.press(signupButton)

    expect(reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: homeNavConfig[0] }],
    })
  })
})
