import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { AccessibilityFooter } from 'shared/AccessibilityFooter/AccessibilityFooter'
import { fireEvent, render, screen } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('AccessibilityFooter', () => {
  it('should go to CGUs when the "CGU utilisateurs" link is pressed', () => {
    render(<AccessibilityFooter />)
    const passCultureButton = screen.getByText('CGU utilisateurs')

    fireEvent.click(passCultureButton)

    expect(openUrl).toHaveBeenCalledWith('https://passculture.cgu', undefined, true)
  })

  it('should go to personal data page when the "Charte des données personnelles" link is pressed', () => {
    render(<AccessibilityFooter />)
    const passCultureButton = screen.getByText('Charte des données personnelles')

    fireEvent.click(passCultureButton)

    expect(openUrl).toHaveBeenCalledWith('https://passculture.privacy', undefined, true)
  })

  it('should go to A11y page when the "Accessibilité : partiellement conforme" link is pressed', () => {
    render(<AccessibilityFooter />)
    const passCultureButton = screen.getByText('Accessibilité : partiellement conforme')

    fireEvent.click(passCultureButton)

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: undefined,
      screen: 'Accessibility',
    })
  })

  it('should go to legal info page when the "Informations légales" link is pressed', () => {
    render(<AccessibilityFooter />)
    const passCultureButton = screen.getByText('Informations légales')

    fireEvent.click(passCultureButton)

    expect(navigate).toHaveBeenCalledWith('ProfileStackNavigator', {
      params: undefined,
      screen: 'LegalNotices',
    })
  })
})
