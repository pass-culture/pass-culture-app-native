import React from 'react'

import { contactSupport } from 'features/auth/support.services'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { AccessibilityEngagement } from 'features/profile/pages/Accessibility/AccessibilityEngagement'
import { render, fireEvent } from 'tests/utils'

const openURLSpy = jest.spyOn(NavigationHelpers, 'openUrl')

describe('ContactSupportButton', () => {
  it('should open mail app when clicking on contact service button', () => {
    const { getByText } = render(<AccessibilityEngagement />)

    const button = getByText('support@passculture.app')
    fireEvent.press(button)

    expect(openURLSpy).toHaveBeenCalledWith(
      contactSupport.forGenericQuestion.url,
      contactSupport.forGenericQuestion.params
    )
  })
})
