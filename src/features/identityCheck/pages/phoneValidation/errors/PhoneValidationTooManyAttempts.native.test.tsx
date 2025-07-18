import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { contactSupport } from 'features/auth/helpers/contactSupport'
import { PhoneValidationTooManyAttempts } from 'features/identityCheck/pages/phoneValidation/errors/PhoneValidationTooManyAttempts'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { homeNavigationConfig } from 'features/navigation/TabBar/helpers'
import { userEvent, render, waitFor, screen } from 'tests/utils'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

jest.mock('libs/firebase/analytics/analytics')
jest.useFakeTimers()

describe('PhoneValidationTooManyAttempts', () => {
  it('should render correctly', () => {
    render(<PhoneValidationTooManyAttempts />)

    expect(screen).toMatchSnapshot()
  })

  it('should open mail app when clicking on contact support button', async () => {
    render(<PhoneValidationTooManyAttempts />)

    const contactSupportButton = screen.getByText('Contacter le support')
    await userEvent.press(contactSupportButton)

    await waitFor(() => {
      expect(openUrl).toHaveBeenCalledWith(
        contactSupport.forPhoneNumberConfirmation.url,
        contactSupport.forPhoneNumberConfirmation.params,
        true
      )
    })
  })

  it('should redirect to Home when clicking on homepage button', async () => {
    render(<PhoneValidationTooManyAttempts />)
    await userEvent.press(screen.getByText('Retourner à l’accueil'))

    expect(navigate).toHaveBeenCalledWith(homeNavigationConfig[0], homeNavigationConfig[1])
  })
})
