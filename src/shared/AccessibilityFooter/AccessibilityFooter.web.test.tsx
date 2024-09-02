import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { AccessibilityFooter } from 'shared/AccessibilityFooter/AccessibilityFooter'
import { fireEvent, render, screen } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

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

    expect(openUrl).toHaveBeenCalledWith('https://passculture.data-privacy-chart', undefined, true)
  })

  it('should go to A11y page when the "Accessibilité : partiellement conforme" link is pressed', () => {
    render(<AccessibilityFooter />)
    const passCultureButton = screen.getByText('Accessibilité : partiellement conforme')

    fireEvent.click(passCultureButton)

    expect(navigate).toHaveBeenCalledWith('Accessibility', undefined)
  })

  it('should go to legal info page when the "Mentions légales" link is pressed', () => {
    render(<AccessibilityFooter />)
    const passCultureButton = screen.getByText('Mentions légales')

    fireEvent.click(passCultureButton)

    expect(navigate).toHaveBeenCalledWith('LegalNotices', undefined)
  })
})
