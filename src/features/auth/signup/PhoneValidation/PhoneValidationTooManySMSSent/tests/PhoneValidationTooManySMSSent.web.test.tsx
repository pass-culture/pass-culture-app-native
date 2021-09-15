import React from 'react'

import { PhoneValidationTooManySMSSent } from 'features/auth/signup/PhoneValidation/PhoneValidationTooManySMSSent'
import { navigateToHome } from 'features/navigation/helpers'
import { fireEvent, render } from 'tests/utils/web'

jest.mock('features/navigation/helpers')

describe('Navigate to home button', () => {
  it('should redirect to Home when clicking on homepage button', async () => {
    const { getByText } = render(<PhoneValidationTooManySMSSent />)

    fireEvent.click(getByText("Retourner à l'accueil"))

    expect(navigateToHome).toBeCalled()
  })
})
