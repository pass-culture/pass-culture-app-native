import React from 'react'

import { BatchEvent, BatchProfile } from '__mocks__/@batch.com/react-native-plugin'
import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, userEvent, screen } from 'tests/utils'

import { VerifyEligibility } from './VerifyEligibility'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/navigationRef')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('<VerifyEligibility />', () => {
  beforeEach(() => setFeatureFlags())

  it('should show the correct deposit amount', () => {
    render(<VerifyEligibility />)

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to home page WHEN "Vérifier mon identité plus tard" button is clicked', async () => {
    render(<VerifyEligibility />)

    const checkButton = screen.getByText('Vérifier mon identité plus tard')
    await user.press(checkButton)

    expect(navigateFromRef).toHaveBeenCalledWith(
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })

  it('should navigate to Stepper WHEN clicking on "Commencer la vérification" button', async () => {
    render(<VerifyEligibility />)

    const startButton = screen.getByText('Commencer la vérification')
    await user.press(startButton)

    expect(navigate).toHaveBeenCalledWith('SubscriptionStackNavigator', {
      screen: 'Stepper',
      params: { from: StepperOrigin.VERIFY_ELIGIBILITY },
    })
  })

  it('should track Batch event when "Vérifier mon identité plus tard" button is clicked', async () => {
    render(<VerifyEligibility />)

    await user.press(await screen.findByLabelText('Vérifier mon identité plus tard'))

    expect(BatchProfile.trackEvent).toHaveBeenCalledWith('has_validated_eligible_account')
  })

  it('should track Batch event when the screen is mounted', async () => {
    render(<VerifyEligibility />)

    await screen.findByText('Vérifie ton identité pour débloquer ton crédit')

    expect(BatchProfile.trackEvent).toHaveBeenCalledWith(BatchEvent.screenViewVerifyEligibility)
  })
})
