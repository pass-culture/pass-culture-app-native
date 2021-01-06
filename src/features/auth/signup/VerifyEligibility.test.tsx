import { StackScreenProps } from '@react-navigation/stack'
import { render, fireEvent } from '@testing-library/react-native'
import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { RootStackParamList } from 'features/navigation/RootNavigator'

import { VerifyEligibility } from './VerifyEligibility'

beforeEach(() => {
  jest.clearAllMocks()
})

const navigationProps = {
  route: { params: { email: 'test@email.com', licenceToken: 'xXLicenceTokenXx' } },
} as StackScreenProps<RootStackParamList, 'VerifyEligibility'>

describe('<VerifyEligibility />', () => {
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
