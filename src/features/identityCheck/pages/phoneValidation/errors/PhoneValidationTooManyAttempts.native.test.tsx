import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { contactSupport } from 'features/auth/helpers/contactSupport'
import { PhoneValidationTooManyAttempts } from 'features/identityCheck/pages/phoneValidation/errors/PhoneValidationTooManyAttempts'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { fireEvent, render, waitFor, screen } from 'tests/utils'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('Contact support button', () => {
  it('should open mail app when clicking on contact support button', async () => {
    render(<PhoneValidationTooManyAttempts />)

    const contactSupportButton = screen.getByText('Contacter le support')
    fireEvent.press(contactSupportButton)

    await waitFor(() => {
      expect(openUrl).toHaveBeenCalledWith(
        contactSupport.forPhoneNumberConfirmation.url,
        contactSupport.forPhoneNumberConfirmation.params,
        true
      )
    })
  })
})

jest.mock('libs/firebase/analytics/analytics')

describe('Navigate to home button', () => {
  it('should redirect to Home when clicking on homepage button', async () => {
    render(<PhoneValidationTooManyAttempts />)
    fireEvent.press(screen.getByText('Retourner à l’accueil'))

    expect(navigate).toHaveBeenCalledWith(homeNavConfig[0], homeNavConfig[1])
  })
})
