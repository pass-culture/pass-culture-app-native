import React from 'react'

import { PhoneValidationTooManySMSSent } from 'features/auth/signup/PhoneValidation/PhoneValidationTooManySMSSent'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { navigateFromRef } from 'features/navigation/navigationRef'
import { fireEvent, render } from 'tests/utils/web'

jest.mock('features/navigation/helpers')
jest.mock('features/navigation/navigationRef')

describe('Navigate to home button', () => {
  it('should redirect to Home when clicking on homepage button', async () => {
    const { getByText } = render(<PhoneValidationTooManySMSSent />)

    fireEvent.click(getByText("Retourner à l'accueil"))

    expect(navigateFromRef).toBeCalledWith(navigateToHomeConfig.screen, navigateToHomeConfig.params)
  })
})
