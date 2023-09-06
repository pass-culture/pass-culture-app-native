import React from 'react'

import { render } from 'tests/utils'
import { AccessibilityBlock } from 'ui/components/accessibility/AccessibilityBlock'

describe('AccessibilityBlock', () => {
  it('renders all handicap information', () => {
    const { queryByTestId } = render(
      <AccessibilityBlock
        audioDisability
        motorDisability={false}
        mentalDisability
        visualDisability={false}
      />
    )
    expect(queryByTestId('Handicap visuel')).toBeOnTheScreen()
    expect(queryByTestId('Handicap moteur')).toBeOnTheScreen()
    expect(queryByTestId('Handicap psychique ou cognitif')).toBeOnTheScreen()
    expect(queryByTestId('Handicap auditif')).toBeOnTheScreen()
  })
  it('renders only available handicap information', () => {
    const { queryByTestId } = render(
      <AccessibilityBlock
        audioDisability={undefined}
        motorDisability={false}
        mentalDisability
        visualDisability={false}
      />
    )
    expect(queryByTestId('Handicap visuel')).toBeOnTheScreen()
    expect(queryByTestId('Handicap moteur')).toBeOnTheScreen()
    expect(queryByTestId('Handicap psychique ou cognitif')).toBeOnTheScreen()
    expect(queryByTestId('Handicap auditif')).not.toBeOnTheScreen()
  })
})
