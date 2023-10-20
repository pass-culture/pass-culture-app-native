import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { AccessibilityActionPlan } from 'features/profile/pages/Accessibility/AccessibilityActionPlan'
import { render, fireEvent, screen } from 'tests/utils'

const openURLSpy = jest.spyOn(NavigationHelpers, 'openUrl')

describe('AccessibilityActionPlan', () => {
  it('should render correctly', () => {
    render(<AccessibilityActionPlan />)
    expect(screen).toMatchSnapshot()
  })

  it.each([
    'https://pass.culture.fr/',
    'https://passculture.app/accueil',
    'https://passculture.pro/',
  ])('should open $link when clicking help center link', (link) => {
    render(<AccessibilityActionPlan />)

    const linkComponent = screen.getByText(link)
    fireEvent.press(linkComponent)

    expect(openURLSpy).toHaveBeenCalledWith(link, undefined, true)
  })
})
