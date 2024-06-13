import React from 'react'

import { render, screen } from 'tests/utils'
import { AccessibilityBlock } from 'ui/components/accessibility/AccessibilityBlock'

describe('AccessibilityBlock', () => {
  it('should render BasicAccessibilityInfo when basicAccessibility is provided', () => {
    render(
      <AccessibilityBlock
        basicAccessibility={{
          audioDisability: true,
          motorDisability: false,
          mentalDisability: true,
          visualDisability: false,
        }}
      />
    )

    expect(screen.getByTestId('BasicAccessibilityInfo')).toBeOnTheScreen()
  })

  it('should render null when basicAccessibility is not provided', () => {
    render(<AccessibilityBlock />)

    expect(screen.queryByTestId('BasicAccessibilityInfo')).not.toBeOnTheScreen()
  })
})
