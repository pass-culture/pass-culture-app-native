import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { AccessibilityEngagement } from 'features/profile/pages/Accessibility/AccessibilityEngagement'
import { env } from 'libs/environment'
import { render, fireEvent } from 'tests/utils'

const openURLSpy = jest.spyOn(NavigationHelpers, 'openUrl')

describe('AccessibilityEngagement', () => {
  it('should render correctly', () => {
    const renderAPI = render(<AccessibilityEngagement />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should open FAQ when clicking help center link', () => {
    const { getByText } = render(<AccessibilityEngagement />)

    const button = getByText('notre centre d’aide')
    fireEvent.press(button)

    expect(openURLSpy).toHaveBeenCalledWith(env.FAQ_LINK, undefined)
  })
})
