import React from 'react'

import { contactSupport } from 'features/auth/helpers/contactSupport'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { AccessibilityEngagement } from 'features/profile/pages/Accessibility/AccessibilityEngagement'
import { render, fireEvent, screen } from 'tests/utils'

const openURLSpy = jest.spyOn(NavigationHelpers, 'openUrl')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('ContactSupportButton', () => {
  it('should open mail app when clicking on contact service button', () => {
    render(<AccessibilityEngagement />)

    const button = screen.getByText('support@passculture.app')
    fireEvent.press(button)

    expect(openURLSpy).toHaveBeenCalledWith(
      contactSupport.forGenericQuestion.url,
      contactSupport.forGenericQuestion.params,
      true
    )
  })
})
