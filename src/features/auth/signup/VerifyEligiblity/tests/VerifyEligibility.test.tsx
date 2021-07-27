import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { navigateToHome } from 'features/navigation/helpers'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { render, fireEvent } from 'tests/utils'

import { VerifyEligibility } from '../VerifyEligibility'

beforeEach(() => {
  jest.clearAllMocks()
})

let mockDepositAmount = '300 €'
jest.mock('features/auth/api', () => ({ useDepositAmount: () => mockDepositAmount }))
jest.mock('features/auth/settings')
jest.mock('features/navigation/helpers')
jest.mock('react-query')

const navigationProps = {
  route: {
    params: {
      email: 'christophe.dupont@gmail.com',
      nextBeneficiaryValidationStep: 'id-check',
    },
  },
} as StackScreenProps<RootStackParamList, 'VerifyEligibility'>

describe('<VerifyEligibility />', () => {
  it('should show the correct deposit amount', async () => {
    mockDepositAmount = '300 €'
    let queryByText = render(<VerifyEligibility {...navigationProps} />).queryByText
    expect(queryByText(/aide financière de 300 € offerte par le Ministère/)).toBeTruthy()

    mockDepositAmount = '500 €'
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
    expect(navigate).toBeCalledWith('IdCheck', {
      email: 'christophe.dupont@gmail.com',
      expiration_timestamp: undefined,
      licence_token: undefined,
    })
  })
})
