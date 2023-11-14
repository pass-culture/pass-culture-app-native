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

  it('renders all handicap information when nothing is accessible', () => {
    render(
      <AccessibilityBlock
        audioDisability={false}
        motorDisability={false}
        mentalDisability={false}
        visualDisability={false}
      />
    )

    expect(screen.queryByTestId('Handicap visuel')).toBeOnTheScreen()
    expect(screen.queryByTestId('Handicap moteur')).toBeOnTheScreen()
    expect(screen.queryByTestId('Handicap psychique ou cognitif')).toBeOnTheScreen()
    expect(screen.queryByTestId('Handicap auditif')).toBeOnTheScreen()
  })

  it('renders nothing when no available handicap information', () => {
    render(
      <AccessibilityBlock
        audioDisability={null}
        motorDisability={null}
        mentalDisability={null}
        visualDisability={null}
      />
    )

    expect(screen.queryByTestId('Handicap visuel')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('Handicap moteur')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('Handicap psychique ou cognitif')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('Handicap auditif')).not.toBeOnTheScreen()
  })
})
