import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { useBeneficiaryValidationNavigation } from 'features/auth/helpers/useBeneficiaryValidationNavigation'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { render, fireEvent, screen } from 'tests/utils'

import { VerifyEligibility } from './VerifyEligibility'

jest.mock('features/navigation/helpers')
jest.mock('features/navigation/navigationRef')
jest.mock('react-query')
jest.mock('features/auth/helpers/useBeneficiaryValidationNavigation')

describe('<VerifyEligibility />', () => {
  it('should show the correct deposit amount', () => {
    const VerifyEligibilityComponent = render(<VerifyEligibility />)
    expect(VerifyEligibilityComponent).toMatchSnapshot()
  })

  it('should redirect to home page WHEN "Vérifier mon identité plus tard" button is clicked', () => {
    render(<VerifyEligibility />)

    const checkButton = screen.getByText('Vérifier mon identité plus tard')
    fireEvent.press(checkButton)

    expect(navigateFromRef).toBeCalledWith(navigateToHomeConfig.screen, navigateToHomeConfig.params)
  })

  it('should navigate to nextBeneficiaryValidationStep WHEN clicking on "Commencer la vérification" button', () => {
    const setError = jest.fn()
    const { nextBeneficiaryValidationStepNavConfig } = useBeneficiaryValidationNavigation(setError)
    render(<VerifyEligibility />)

    const startButton = screen.getByText('Commencer la vérification')
    fireEvent.press(startButton)

    expect(navigate).toBeCalledWith(
      nextBeneficiaryValidationStepNavConfig?.screen,
      nextBeneficiaryValidationStepNavConfig?.params
    )
  })
})
