import React from 'react'
import { mocked } from 'ts-jest/utils'
import waitForExpect from 'wait-for-expect'

import { useDepositAmountsByAge } from 'features/auth/api'
import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { navigateToHome } from 'features/navigation/helpers'
import { render, fireEvent } from 'tests/utils'

import { VerifyEligibility } from '../VerifyEligibility'

jest.mock('features/auth/api')
jest.mock('features/auth/settings')
jest.mock('features/navigation/helpers')
jest.mock('react-query')
jest.mock('features/auth/signup/useBeneficiaryValidationNavigation')

const mockedUseDepositAmountsByAge = mocked(useDepositAmountsByAge)

describe('<VerifyEligibility />', () => {
  it('should show the correct deposit amount', async () => {
    let queryByText = render(<VerifyEligibility />).queryByText
    expect(queryByText(/aide financière de 300 € offerte par le Ministère/)).toBeTruthy()

    mockedUseDepositAmountsByAge.mockReturnValueOnce({
      ...mockedUseDepositAmountsByAge(),
      eighteenYearsOldDeposit: '500 €',
    })
    queryByText = render(<VerifyEligibility />).queryByText
    expect(queryByText(/aide financière de 500 € offerte par le Ministère/)).toBeTruthy()
  })

  it('should redirect to home page WHEN go back to home button is clicked', async () => {
    const { findByText } = render(<VerifyEligibility />)

    const button = await findByText("Retourner à l'accueil")
    fireEvent.press(button)

    expect(navigateToHome).toBeCalled()
  })

  it('should navigate to nextBeneficiaryValidationStep WHEN clicking on "Vérifier mon éligibilité" button', async () => {
    const {
      navigateToNextBeneficiaryValidationStep: mockedNavigateToNextBeneficiaryValidationStep,
    } = useBeneficiaryValidationNavigation()
    const { findByText } = render(<VerifyEligibility />)

    const button = await findByText('Vérifier mon éligibilité')
    fireEvent.press(button)

    await waitForExpect(() => {
      expect(mockedNavigateToNextBeneficiaryValidationStep).toBeCalled()
    })
  })
})
