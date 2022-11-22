import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { AccessibilityActionPlan } from 'features/profile/pages/Accessibility/AccessibilityActionPlan'
import { render, fireEvent } from 'tests/utils'

const openURLSpy = jest.spyOn(NavigationHelpers, 'openUrl')

describe('AccessibilityActionPlan', () => {
  it('should render correctly', () => {
    const renderAPI = render(<AccessibilityActionPlan />)
    expect(renderAPI).toMatchSnapshot()
  })

  it.each([
    'https://pass.culture.fr/',
    'https://passculture.app/accueil',
    'https://passculture.pro/',
  ])('should open $link when clicking help center link', (link) => {
    const { getByText } = render(<AccessibilityActionPlan />)

    const linkComponent = getByText(link)
    fireEvent.press(linkComponent)

    expect(openURLSpy).toHaveBeenCalledWith(link, undefined)
  })
})
