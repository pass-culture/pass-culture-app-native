import React from 'react'

import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { DisplayPreference } from './DisplayPreference'

jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('DisplayPreference', () => {
  it('should not have basic accessibility issues', async () => {
    const { container } = render(<DisplayPreference />)
    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })

  it('should display correct subtitle', () => {
    render(<DisplayPreference />)

    const webSubtitle = screen.getByText('L’affichage en mode paysage n’est pas disponible en web')

    expect(webSubtitle).toBeInTheDocument()
  })

  it('should disable phone rotation toggle', () => {
    render(<DisplayPreference />)

    expect(screen.getByTestId('Interrupteur Rotation')).toHaveAttribute('aria-disabled', 'true')
  })
})
