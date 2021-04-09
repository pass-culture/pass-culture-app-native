import { StackScreenProps } from '@react-navigation/stack'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { RootStackParamList } from 'features/navigation/RootNavigator'
import { render, fireEvent } from 'tests/utils'

import { VerifyEligibility } from './VerifyEligibility'

beforeEach(() => {
  jest.clearAllMocks()
})

let mockDepositAmount = '300 €'
jest.mock('features/auth/api', () => ({ useDepositAmount: () => mockDepositAmount }))

const navigationProps = {
  route: { params: { email: 'test@email.com', licenceToken: 'xXLicenceTokenXx' } },
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

    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('Home', {
      shouldDisplayLoginModal: false,
    })
  })

  it('should redirect to IdCheck screen WHEN clicking on "Vérifier mon éligibilité" button', async () => {
    const { findByText } = render(<VerifyEligibility {...navigationProps} />)

    const button = await findByText('Vérifier mon éligibilité')
    fireEvent.press(button)

    expect(navigate).toBeCalledTimes(1)
    expect(navigate).toBeCalledWith('IdCheck', {
      email: 'test@email.com',
      licenceToken: 'xXLicenceTokenXx',
    })
  })
})
