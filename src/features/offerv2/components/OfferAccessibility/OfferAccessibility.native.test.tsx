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

    expect(screen.getByTestId('Handicap visuel')).toBeOnTheScreen()
    expect(screen.getByTestId('Handicap moteur')).toBeOnTheScreen()
    expect(screen.getByTestId('Handicap psychique ou cognitif')).toBeOnTheScreen()
    expect(screen.getByTestId('Handicap auditif')).toBeOnTheScreen()
  })

  it('should not display accessibility block when there is not handicap information', () => {
    render(<OfferAccessibility accessibility={{}} />)

    expect(screen.queryByTestId('Handicap visuel')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('Handicap moteur')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('Handicap psychique ou cognitif')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('Handicap auditif')).not.toBeOnTheScreen()
  })
})
