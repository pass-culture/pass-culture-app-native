import React from 'react'

import { render, screen } from 'tests/utils/web'

import { AccessibilityFooter } from './AccessibilityFooter'

describe('AccessibilityFooter (web)', () => {
  it('should render footer container', () => {
    render(<AccessibilityFooter />)

    expect(screen.getByTestId('accessibility-footer-container')).toBeInTheDocument()

    expect(screen.getByTestId('accessibility-footer-container').tagName).toBe('FOOTER')
  })
})
