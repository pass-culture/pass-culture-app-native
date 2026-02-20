import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { env } from 'libs/environment/env'
import { AccessibilityFooter } from 'shared/AccessibilityFooter/AccessibilityFooter'
import { render, screen, userEvent } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

const user = userEvent.setup()

describe('AccessibilityFooter', () => {
  it('should render a native View container', () => {
    render(<AccessibilityFooter />)

    const container = screen.getByTestId('accessibility-footer-container')

    expect(container.type).toBe('View')
  })

  it('should go to CGUs when the "Conditions Générales d’Utilisation" link is pressed', async () => {
    render(<AccessibilityFooter />)
    const cguButton = screen.getByText('Conditions Générales d’Utilisation')

    await user.press(cguButton)

    expect(openUrl).toHaveBeenCalledWith(env.CGU_LINK, undefined, true)
  })

  it('should go to personal data page when the "Charte des données personnelles" link is pressed', async () => {
    render(<AccessibilityFooter />)
    const personalDataButton = screen.getByText('Charte des données personnelles')

    await user.press(personalDataButton)

    expect(openUrl).toHaveBeenCalledWith(env.PRIVACY_POLICY_LINK, undefined, true)
  })

  it('should go to code of conduct page when the "Charte d’utilisation et de bonne conduite" link is pressed', async () => {
    render(<AccessibilityFooter />)
    const codeOfConductButton = screen.getByText('Charte d’utilisation et de bonne conduite')

    await user.press(codeOfConductButton)

    expect(openUrl).toHaveBeenCalledWith(env.CODE_OF_CONDUCT_LINK, undefined, true)
  })

  it('should go to A11y page when the "Accessibilité : partiellement conforme" button is pressed', async () => {
    render(<AccessibilityFooter />)
    const passCultureButton = screen.getByText('Accessibilité : partiellement conforme')

    await user.press(passCultureButton)

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: undefined,
      screen: 'Accessibility',
    })
  })

  it('should go to site map page when the "Plan du site" button is pressed', async () => {
    render(<AccessibilityFooter />)
    const siteMapButton = screen.getByText('Plan du site')

    await user.press(siteMapButton)

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: undefined,
      screen: 'SiteMapScreen',
    })
  })

  it('should go to legal info page when the "Informations légales" button is pressed', async () => {
    render(<AccessibilityFooter />)
    const legalInfoButton = screen.getByText('Informations légales')

    await user.press(legalInfoButton)

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: undefined,
      screen: 'LegalNotices',
    })
  })
})
