import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { AccessibilityActionPlan } from 'features/profile/pages/Accessibility/AccessibilityActionPlan'
import { render, fireEvent, screen } from 'tests/utils'

const openURLSpy = jest.spyOn(NavigationHelpers, 'openUrl')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('AccessibilityActionPlan', () => {
  it('should render correctly', () => {
    render(<AccessibilityActionPlan />)

    expect(screen).toMatchSnapshot()
  })

  it.each(['https://pass.culture.fr/', 'https://passculture.app/', 'https://passculture.pro/'])(
    'should open $link when clicking help center link',
    (link) => {
      render(<AccessibilityActionPlan />)

      const linkComponents = screen.getAllByText(link)
      linkComponents.forEach((link) => {
        fireEvent.press(link)
      })

      expect(openURLSpy).toHaveBeenCalledTimes(linkComponents.length)
      expect(openURLSpy).toHaveBeenCalledWith(link, undefined, true)
    }
  )
})
