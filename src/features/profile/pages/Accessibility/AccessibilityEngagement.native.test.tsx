import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { AccessibilityEngagement } from 'features/profile/pages/Accessibility/AccessibilityEngagement'
import { env } from 'libs/environment'
import { render, fireEvent, screen } from 'tests/utils'

const openURLSpy = jest.spyOn(NavigationHelpers, 'openUrl')

jest.mock('libs/firebase/analytics/analytics')

describe('AccessibilityEngagement', () => {
  it('should render correctly', () => {
    render(<AccessibilityEngagement />)

    expect(screen).toMatchSnapshot()
  })

  it('should open FAQ when clicking help center link', () => {
    render(<AccessibilityEngagement />)

    const button = screen.getByText('notre centre d’aide')
    fireEvent.press(button)

    expect(openURLSpy).toHaveBeenCalledWith(env.FAQ_LINK, undefined, true)
  })
})
