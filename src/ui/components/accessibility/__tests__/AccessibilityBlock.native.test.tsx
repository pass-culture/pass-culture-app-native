import React from 'react'

import { render } from 'tests/utils'

import { AccessibilityBlock } from '../AccessibilityBlock'

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
    expect(queryByTestId('Handicap visuel')).toBeTruthy()
    expect(queryByTestId('Handicap moteur')).toBeTruthy()
    expect(queryByTestId('Handicap psychique ou cognitif')).toBeTruthy()
    expect(queryByTestId('Handicap auditif')).toBeTruthy()
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
    expect(queryByTestId('Handicap visuel')).toBeTruthy()
    expect(queryByTestId('Handicap moteur')).toBeTruthy()
    expect(queryByTestId('Handicap psychique ou cognitif')).toBeTruthy()
    expect(queryByTestId('Handicap auditif')).toBeNull()
  })
})
