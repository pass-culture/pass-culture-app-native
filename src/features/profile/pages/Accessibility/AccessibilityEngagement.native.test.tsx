import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { AccessibilityEngagement } from 'features/profile/pages/Accessibility/AccessibilityEngagement'
import { env } from 'libs/environment/env'
import { render, userEvent, screen } from 'tests/utils'

const openURLSpy = jest.spyOn(NavigationHelpers, 'openUrl')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

const user = userEvent.setup()
jest.useFakeTimers()

describe('AccessibilityEngagement', () => {
  it('should render correctly', () => {
    render(<AccessibilityEngagement />)

    expect(screen).toMatchSnapshot()
  })

  it('should open FAQ when clicking help center link', async () => {
    render(<AccessibilityEngagement />)

    const button = screen.getByText('notre centre d’aide')
    await user.press(button)

    expect(openURLSpy).toHaveBeenCalledWith(env.FAQ_LINK, undefined, true)
  })
})
