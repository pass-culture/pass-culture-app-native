import React from 'react'
import waitForExpect from 'wait-for-expect'

import { PhoneValidationTooManyAttempts } from 'features/auth/signup/PhoneValidation/PhoneValidationTooManyAttempts'
import { contactSupport } from 'features/auth/support.services'
import { navigateToHome } from 'features/navigation/helpers'
import { fireEvent, render } from 'tests/utils'

jest.mock('features/navigation/helpers')

describe('Contact support button', () => {
  it('should open mail app when clicking on contact support button', async () => {
    const { getByText } = render(<PhoneValidationTooManyAttempts />)

    const contactSupportButton = getByText('Contacter le support')
    fireEvent.press(contactSupportButton)

    await waitForExpect(() => {
      expect(contactSupport.forPhoneNumberConfirmation).toHaveBeenCalled()
    })
  })
})

describe('Navigate to home button', () => {
  it('should redirect to Home when clicking on homepage button', async () => {
    const { getByText } = render(<PhoneValidationTooManyAttempts />)

    fireEvent.press(getByText("Retourner à l'accueil"))

    expect(navigateToHome).toBeCalled()
  })
})
