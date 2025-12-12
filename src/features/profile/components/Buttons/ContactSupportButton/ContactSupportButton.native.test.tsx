import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { AccessibilityEngagement } from 'features/profile/pages/Accessibility/AccessibilityEngagement'
import { env } from 'libs/environment/env'
import { render, screen, userEvent } from 'tests/utils'

const openURLSpy = jest.spyOn(NavigationHelpers, 'openUrl')

jest.mock('libs/firebase/analytics/analytics')

const user = userEvent.setup()
jest.useFakeTimers()

describe('ContactSupportButton', () => {
  it('should open mail app when clicking on contact service button', async () => {
    render(<AccessibilityEngagement />)

    const button = screen.getByText('contacter le support')
    await user.press(button)

    expect(openURLSpy).toHaveBeenCalledWith(env.SUPPORT_ACCOUNT_ISSUES_FORM, undefined, true)
  })
})
