import React from 'react'

import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { OfferAccessibility } from 'features/offerv2/components/OfferAccessibility/OfferAccessibility'
import { render, screen } from 'tests/utils'

const accessibility = offerResponseSnap.accessibility

describe('<OfferAccessibility />', () => {
  it('should display section title when there is at least one handicap information', () => {
    render(<OfferAccessibility accessibility={accessibility} />)

    expect(screen.getByText('Accessibilité de l’offre')).toBeOnTheScreen()
  })

  it('should not display section title when there is not handicap information', () => {
    render(<OfferAccessibility accessibility={{}} />)

    expect(screen.queryByText('Accessibilité de l’offre')).not.toBeOnTheScreen()
  })

  it('should display accessibility block when there is at least one handicap information', () => {
    render(<OfferAccessibility accessibility={accessibility} />)

    expect(screen.getByText('Handicap visuel')).toBeOnTheScreen()
    expect(screen.getByText('Handicap moteur')).toBeOnTheScreen()
    expect(screen.getByText('Handicap psychique ou cognitif')).toBeOnTheScreen()
    expect(screen.getByText('Handicap auditif')).toBeOnTheScreen()
  })

  it('should not display accessibility block when there is not handicap information', () => {
    render(<OfferAccessibility accessibility={{}} />)

    expect(screen.queryByText('Handicap visuel')).not.toBeOnTheScreen()
    expect(screen.queryByText('Handicap moteur')).not.toBeOnTheScreen()
    expect(screen.queryByText('Handicap psychique ou cognitif')).not.toBeOnTheScreen()
    expect(screen.queryByText('Handicap auditif')).not.toBeOnTheScreen()
  })
})
