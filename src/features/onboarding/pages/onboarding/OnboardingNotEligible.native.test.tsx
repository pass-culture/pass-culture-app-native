import React from 'react'

import { navigate, reset } from '__mocks__/@react-navigation/native'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { OnboardingNotEligible } from 'features/onboarding/pages/onboarding/OnboardingNotEligible'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')
jest.useFakeTimers()

describe('OnboardingNotEligible', () => {
  beforeEach(() => setFeatureFlags())

  it('should render correctly', () => {
    render(reactQueryProviderHOC(<OnboardingNotEligible />))

    expect(screen).toMatchSnapshot()
  })

  it('should navigate to SignupForm when pressing "Créer un compte"', async () => {
    render(reactQueryProviderHOC(<OnboardingNotEligible />))

    const signupButton = screen.getByText('Créer un compte')
    await userEvent.press(signupButton)

    expect(navigate).toHaveBeenCalledWith('SignupForm', {
      from: StepperOrigin.ONBOARDING_NOT_ELIGIBLE,
    })
  })

  it('should reset navigation on go to Home when pressing "Accéder au catalogue"', async () => {
    render(reactQueryProviderHOC(<OnboardingNotEligible />))

    const signupButton = screen.getByText('Accéder au catalogue')
    await userEvent.press(signupButton)

    expect(reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: homeNavigationConfig[0] }],
    })
  })

  it('should reset navigation on go to Home when pressing "Plus tard"', async () => {
    render(reactQueryProviderHOC(<OnboardingNotEligible />))

    const signupButton = screen.getByText('Passer')
    await userEvent.press(signupButton)

    expect(reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: homeNavigationConfig[0] }],
    })
  })
})
