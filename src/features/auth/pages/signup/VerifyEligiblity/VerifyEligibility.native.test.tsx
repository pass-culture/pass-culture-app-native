import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { StepperOrigin } from 'features/navigation/RootNavigator/types'
import { render, fireEvent, screen } from 'tests/utils'

import { VerifyEligibility } from './VerifyEligibility'

jest.mock('features/navigation/helpers')
jest.mock('features/navigation/navigationRef')

describe('<VerifyEligibility />', () => {
  it('should show the correct deposit amount', () => {
    render(<VerifyEligibility />)

    expect(screen).toMatchSnapshot()
  })

  it('should redirect to home page WHEN "Vérifier mon identité plus tard" button is clicked', () => {
    render(<VerifyEligibility />)

    const checkButton = screen.getByText('Vérifier mon identité plus tard')
    fireEvent.press(checkButton)

    expect(navigateFromRef).toHaveBeenCalledWith(
      navigateToHomeConfig.screen,
      navigateToHomeConfig.params
    )
  })

  it('should navigate to Stepper WHEN clicking on "Commencer la vérification" button', () => {
    render(<VerifyEligibility />)

    const startButton = screen.getByText('Commencer la vérification')
    fireEvent.press(startButton)

    expect(navigate).toHaveBeenCalledWith('Stepper', { from: StepperOrigin.VERIFY_ELIGIBILITY })
  })
})
