import { render } from '@testing-library/react-native'
import React from 'react'

import { AccessibilityBlock } from '../AccessibilityBlock'

describe('AccessibilityBlock', () => {
  it('renders all handicap information', () => {
    const { queryByTestId } = render(
      <AccessibilityBlock
        audioDisability={true}
        motorDisability={false}
        mentalDisability={true}
        visualDisability={false}
      />
    )
    expect(queryByTestId('Handicap visuel')).toBeTruthy()
    expect(queryByTestId('Handicap moteur')).toBeTruthy()
    expect(queryByTestId('Handicap mental')).toBeTruthy()
    expect(queryByTestId('Handicap auditif')).toBeTruthy()
  })
  it('renders only available handicap information', () => {
    const { queryByTestId } = render(
      <AccessibilityBlock
        audioDisability={undefined}
        motorDisability={false}
        mentalDisability={true}
        visualDisability={false}
      />
    )
    expect(queryByTestId('Handicap visuel')).toBeTruthy()
    expect(queryByTestId('Handicap moteur')).toBeTruthy()
    expect(queryByTestId('Handicap mental')).toBeTruthy()
    expect(queryByTestId('Handicap auditif')).toBeNull()
  })
})
