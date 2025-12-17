import React from 'react'
import { ReactTestInstance } from 'react-test-renderer'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { AccessibilityActionPlan } from 'features/profile/pages/Accessibility/AccessibilityActionPlan'
import { analytics } from 'libs/analytics/provider'
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

describe('AccessibilityActionPlan', () => {
  it('should render correctly', () => {
    render(<AccessibilityActionPlan />)

    expect(screen).toMatchSnapshot()
  })

  it('should open https://pass.culture.fr/ when clicking on "https://pass.culture.fr/" link', async () => {
    render(<AccessibilityActionPlan />)

    const links = screen.getAllByText('https://pass.culture.fr/')
    // Using as because links is never undefined and the typing is not correct
    await user.press(links[0] as ReactTestInstance)

    expect(openURLSpy).toHaveBeenCalledWith('https://pass.culture.fr/', undefined, true)
  })

  it('should open https://passculture.app/ when clicking on "https://passculture.app/" link', async () => {
    render(<AccessibilityActionPlan />)

    const links = screen.getAllByText('https://passculture.app/')
    // Using as because links is never undefined and the typing is not correct
    await user.press(links[0] as ReactTestInstance)

    expect(openURLSpy).toHaveBeenCalledWith('https://passculture.app/', undefined, true)
  })

  it('should open https://passculture.pro/ when clicking on "https://passculture.pro/" link', async () => {
    render(<AccessibilityActionPlan />)

    const links = screen.getAllByText('https://passculture.pro/')
    // Using as because links is never undefined and the typing is not correct
    await user.press(links[0] as ReactTestInstance)

    expect(openURLSpy).toHaveBeenCalledWith('https://passculture.pro/', undefined, true)
  })

  it('should log HasClickedContactForm event when press "Contacter le support" button', async () => {
    render(<AccessibilityActionPlan />)

    const contactSupportButton = screen.getByText('Contacter le support')

    await userEvent.press(contactSupportButton)

    expect(analytics.logHasClickedContactForm).toHaveBeenNthCalledWith(1, 'AccessibilityActionPlan')
  })
})
