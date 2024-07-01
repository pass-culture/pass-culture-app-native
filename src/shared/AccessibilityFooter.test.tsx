import React from 'react'
import { Linking } from 'react-native'

import { navigate } from '__mocks__/@react-navigation/native'
import AccessibilityFooter from 'shared/AccessibilityFooter'
import { fireEvent, render, screen } from 'tests/utils'

// This mock should not be necessary (test should not make any requests)
jest.mock('libs/firebase/analytics/analytics')

describe('AccessibilityFooter', () => {
  it('should go to web app when "pass Culture" link is pressed', async () => {
    render(<AccessibilityFooter />)
    const passCultureButton = screen.getByText('pass Culture')

    fireEvent.press(passCultureButton)

    expect(Linking.openURL).toHaveBeenCalledWith('https://passculture.app/accueil')
  })

  it('should go to CGUs when the "CGU utilisateurs" link is pressed', async () => {
    render(<AccessibilityFooter />)
    const passCultureButton = screen.getByText('CGU utilisateurs')

    fireEvent.press(passCultureButton)

    expect(Linking.openURL).toHaveBeenCalledWith('https://passculture.cgu')
  })

  it('should go to personal data page when the "Charte des données personnelles" link is pressed', async () => {
    render(<AccessibilityFooter />)
    const passCultureButton = screen.getByText('Charte des données personnelles')

    fireEvent.press(passCultureButton)

    expect(Linking.openURL).toHaveBeenCalledWith('https://passculture.data-privacy-chart')
  })

  it('should go to A11y page when the "Accessibilité : partiellement conforme" link is pressed', async () => {
    render(<AccessibilityFooter />)
    const passCultureButton = screen.getByText('Accessibilité : partiellement conforme')

    fireEvent.press(passCultureButton)

    expect(navigate).toHaveBeenCalledWith('Accessibility', undefined)
  })

  it('should go to legal info page when the "Mentions légales" link is pressed', async () => {
    render(<AccessibilityFooter />)
    const passCultureButton = screen.getByText('Mentions légales')

    fireEvent.press(passCultureButton)

    expect(navigate).toHaveBeenCalledWith('LegalNotices', undefined)
  })
})
