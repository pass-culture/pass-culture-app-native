import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { render, fireEvent } from 'tests/utils'

import { VerifyEligibility } from '../VerifyEligibility'

jest.mock('features/auth/api')
jest.mock('features/auth/settings')
jest.mock('features/navigation/helpers')
jest.mock('features/navigation/navigationRef')
jest.mock('react-query')
jest.mock('features/auth/signup/useBeneficiaryValidationNavigation')

describe('<VerifyEligibility />', () => {
  it('should show the correct deposit amount', async () => {
    const VerifyEligibilityComponent = render(<VerifyEligibility />)
    expect(VerifyEligibilityComponent).toMatchSnapshot()
  })

  it('should redirect to home page WHEN go back to home button is clicked', async () => {
    const { findByText } = render(<VerifyEligibility />)

    const button = await findByText('Retourner à l’accueil')
    fireEvent.press(button)

    expect(navigateFromRef).toBeCalledWith(navigateToHomeConfig.screen, navigateToHomeConfig.params)
  })

  it('should navigate to nextBeneficiaryValidationStep WHEN clicking on "Vérifier mon éligibilité" button', async () => {
    const setError = jest.fn()
    const { nextBeneficiaryValidationStepNavConfig } = useBeneficiaryValidationNavigation(setError)
    const { findByText } = render(<VerifyEligibility />)

    const button = await findByText('Commencer la vérification')
    fireEvent.press(button)

    await waitForExpect(() => {
      expect(navigate).toBeCalledWith(
        nextBeneficiaryValidationStepNavConfig?.screen,
        nextBeneficiaryValidationStepNavConfig?.params
      )
    })
  })
})
