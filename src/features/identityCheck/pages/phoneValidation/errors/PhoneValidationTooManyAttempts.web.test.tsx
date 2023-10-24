import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { contactSupport } from 'features/auth/helpers/contactSupport'
import { PhoneValidationTooManyAttempts } from 'features/identityCheck/pages/phoneValidation/errors/PhoneValidationTooManyAttempts'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { checkAccessibilityFor, fireEvent, render, screen, waitFor } from 'tests/utils/web'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('<PhoneValidationTooManyAttempts/>', () => {
  describe('Contact support button', () => {
    it('should open mail app when clicking on contact support button', async () => {
      render(<PhoneValidationTooManyAttempts />)

      const contactSupportButton = screen.getByText('Contacter le support')
      fireEvent.click(contactSupportButton)

      await waitFor(() => {
        expect(openUrl).toHaveBeenCalledWith(
          contactSupport.forPhoneNumberConfirmation.url,
          contactSupport.forPhoneNumberConfirmation.params,
          true
        )
      })
    })
  })

  describe('Navigate to home button', () => {
    it('should redirect to Home when clicking on homepage button', async () => {
      render(<PhoneValidationTooManyAttempts />)

      fireEvent.click(screen.getByText('Retourner à l’accueil'))

      expect(navigate).toHaveBeenCalledWith(...homeNavConfig)
    })
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<PhoneValidationTooManyAttempts />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
