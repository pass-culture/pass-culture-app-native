import React from 'react'

import { render, screen } from 'tests/utils'
import { BasicAccessibilityInfo } from 'ui/components/accessibility/BasicAccessibilityInfo'

describe('BasicAccessibilityInfo', () => {
  it('should render all handicap information', () => {
    render(
      <BasicAccessibilityInfo
        accessibility={{
          audioDisability: true,
          mentalDisability: true,
          motorDisability: true,
          visualDisability: true,
        }}
      />
    )

    expect(screen.getByText('Handicap visuel')).toBeOnTheScreen()
    expect(screen.getByText('Handicap moteur')).toBeOnTheScreen()
    expect(screen.getByText('Handicap psychique ou cognitif')).toBeOnTheScreen()
    expect(screen.getByText('Handicap auditif')).toBeOnTheScreen()
  })

  it('should render only available handicap information', () => {
    render(
      <BasicAccessibilityInfo
        accessibility={{
          audioDisability: undefined,
          motorDisability: false,
          mentalDisability: true,
          visualDisability: false,
        }}
      />
    )

    expect(screen.getByText('Handicap visuel')).toBeOnTheScreen()
    expect(screen.getByText('Handicap moteur')).toBeOnTheScreen()
    expect(screen.getByText('Handicap psychique ou cognitif')).toBeOnTheScreen()
    expect(screen.queryByText('Handicap auditif')).not.toBeOnTheScreen()
  })

  it('should render all handicap information when nothing is accessible', () => {
    render(
      <BasicAccessibilityInfo
        accessibility={{
          audioDisability: false,
          motorDisability: false,
          mentalDisability: false,
          visualDisability: false,
        }}
      />
    )

    expect(screen.getByText('Handicap visuel')).toBeOnTheScreen()
    expect(screen.getByText('Handicap moteur')).toBeOnTheScreen()
    expect(screen.getByText('Handicap psychique ou cognitif')).toBeOnTheScreen()
    expect(screen.getByText('Handicap auditif')).toBeOnTheScreen()
  })

  it('should render nothing when no available handicap information', () => {
    render(
      <BasicAccessibilityInfo
        accessibility={{
          audioDisability: null,
          motorDisability: null,
          mentalDisability: null,
          visualDisability: null,
        }}
      />
    )

    expect(screen.queryByText('Handicap visuel')).not.toBeOnTheScreen()
    expect(screen.queryByText('Handicap moteur')).not.toBeOnTheScreen()
    expect(screen.queryByText('Handicap psychique ou cognitif')).not.toBeOnTheScreen()
    expect(screen.queryByText('Handicap auditif')).not.toBeOnTheScreen()
  })
})
