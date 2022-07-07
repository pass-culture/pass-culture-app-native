import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { PhoneValidationTooManySMSSent } from 'features/auth/signup/PhoneValidation/PhoneValidationTooManySMSSent'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { fireEvent, render } from 'tests/utils'

jest.mock('features/navigation/helpers')
jest.mock('features/navigation/navigationRef')

describe('Navigate to home button', () => {
  it('should redirect to Home when clicking on homepage button', async () => {
    const { getByText } = render(<PhoneValidationTooManySMSSent />)

    fireEvent.press(getByText("Retourner à l'accueil"))

    expect(navigateFromRef).toBeCalledWith(navigateToHomeConfig.screen, navigateToHomeConfig.params)
  })
  it('should redirect to SetPhoneValidationCode when clicking on second button', async () => {
    const { getByText } = render(<PhoneValidationTooManySMSSent />)

    fireEvent.press(getByText("J'ai reçu mon code"))

    expect(navigate).toBeCalledWith('SetPhoneValidationCode', undefined)
  })
})
