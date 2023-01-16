import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { contactSupport } from 'features/auth/helpers/contactSupport'
import { PhoneValidationTooManyAttempts } from 'features/identityCheck/pages/phoneValidation/errors/PhoneValidationTooManyAttempts'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { fireEvent, render, waitFor } from 'tests/utils'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('Contact support button', () => {
  it('should open mail app when clicking on contact support button', async () => {
    const { getByText } = render(<PhoneValidationTooManyAttempts />)

    const contactSupportButton = getByText('Contacter le support')
    fireEvent.press(contactSupportButton)

    await waitFor(() => {
      expect(openUrl).toBeCalledWith(
        contactSupport.forPhoneNumberConfirmation.url,
        contactSupport.forPhoneNumberConfirmation.params,
        true
      )
    })
  })
})

describe('Navigate to home button', () => {
  it('should redirect to Home when clicking on homepage button', async () => {
    const { getByText } = render(<PhoneValidationTooManyAttempts />)
    fireEvent.press(getByText('Retourner à l’accueil'))

    expect(navigate).toBeCalledWith(homeNavConfig[0], homeNavConfig[1])
  })
})
