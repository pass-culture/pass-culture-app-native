import React from 'react'

import { render, screen } from 'tests/utils'
import { AccessibilityBlock } from 'ui/components/accessibility/AccessibilityBlock'

describe('AccessibilityBlock', () => {
  it('renders all handicap information', () => {
    render(
      <AccessibilityBlock
        audioDisability
        motorDisability={false}
        mentalDisability
        visualDisability={false}
      />
    )

    expect(screen.queryByTestId('Handicap visuel')).toBeOnTheScreen()
    expect(screen.queryByTestId('Handicap moteur')).toBeOnTheScreen()
    expect(screen.queryByTestId('Handicap psychique ou cognitif')).toBeOnTheScreen()
    expect(screen.queryByTestId('Handicap auditif')).toBeOnTheScreen()
  })
  it('renders only available handicap information', () => {
    render(
      <AccessibilityBlock
        audioDisability={undefined}
        motorDisability={false}
        mentalDisability
        visualDisability={false}
      />
    )

    expect(screen.queryByTestId('Handicap visuel')).toBeOnTheScreen()
    expect(screen.queryByTestId('Handicap moteur')).toBeOnTheScreen()
    expect(screen.queryByTestId('Handicap psychique ou cognitif')).toBeOnTheScreen()
    expect(screen.queryByTestId('Handicap auditif')).not.toBeOnTheScreen()
  })
})
