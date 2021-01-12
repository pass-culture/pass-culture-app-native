import { render } from '@testing-library/react-native'
import React from 'react'

import { AccessibilityBlock } from '../AccessibilityBlock'

describe('AccessibilityBlock', () => {
  it('renders all handicap information', () => {
    const { queryByText } = render(
      <AccessibilityBlock
        audioDisability={true}
        motorDisability={false}
        mentalDisability={true}
        visualDisability={false}
      />
    )
    expect(queryByText('Handicap visuel')).toBeTruthy()
    expect(queryByText('Handicap moteur')).toBeTruthy()
    expect(queryByText('Handicap mental')).toBeTruthy()
    expect(queryByText('Handicap auditif')).toBeTruthy()
  })
  it('renders only available handicap information', () => {
    const { queryByText } = render(<AccessibilityBlock
      audioDisability={undefined}
      motorDisability={false}
      mentalDisability={true}
      visualDisability={false}
    />)
    expect(queryByText('Handicap visuel')).toBeTruthy()
    expect(queryByText('Handicap moteur')).toBeTruthy()
    expect(queryByText('Handicap mental')).toBeTruthy()
    expect(queryByText('Handicap auditif')).toBeNull()
  })
})
