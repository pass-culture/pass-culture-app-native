import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { mocked } from 'ts-jest/utils'

import { navigate } from '__mocks__/@react-navigation/native'
import { useDepositAmountsByAge } from 'features/auth/api'
import { navigateToHome } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { render, fireEvent } from 'tests/utils'

import { VerifyEligibility } from '../VerifyEligibility'

jest.mock('features/auth/api')
jest.mock('features/auth/settings')
jest.mock('features/navigation/helpers')
jest.mock('react-query')

const mockedUseDepositAmountsByAge = mocked(useDepositAmountsByAge)

const navigationProps = {
  route: {
    params: {
      nextBeneficiaryValidationStep: 'id-check',
    },
  },
} as StackScreenProps<RootStackParamList, 'VerifyEligibility'>

describe('<VerifyEligibility />', () => {
  it('should show the correct deposit amount', async () => {
    let queryByText = render(<VerifyEligibility {...navigationProps} />).queryByText
    expect(queryByText(/aide financière de 300 € offerte par le Ministère/)).toBeTruthy()

    mockedUseDepositAmountsByAge.mockReturnValueOnce({
      ...mockedUseDepositAmountsByAge(),
      eighteenYearsOldDeposit: '500 €',
    })
    queryByText = render(<VerifyEligibility {...navigationProps} />).queryByText
    expect(queryByText(/aide financière de 500 € offerte par le Ministère/)).toBeTruthy()
  })

  it('should redirect to home page WHEN go back to home button is clicked', async () => {
    const { findByText } = render(<VerifyEligibility {...navigationProps} />)

    const button = await findByText("Retourner à l'accueil")
    fireEvent.press(button)

    expect(navigateToHome).toBeCalled()
  })

  it('should redirect to IdCheck screen WHEN clicking on "Vérifier mon éligibilité" button', async () => {
    const { findByText } = render(<VerifyEligibility {...navigationProps} />)

    const button = await findByText('Vérifier mon éligibilité')
    fireEvent.press(button)

    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('IdCheckV2')
  })
})
