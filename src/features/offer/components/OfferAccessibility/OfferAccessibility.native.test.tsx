import React from 'react'

import { OfferAccessibility } from 'features/offer/components/OfferAccessibility/OfferAccessibility'
import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const accessibility = offerResponseSnap.accessibility

describe('<OfferAccessibility />', () => {
  it('should display section title when there is at least one handicap information', () => {
    render(<OfferAccessibility accessibility={accessibility} />)

    expect(screen.getByText('Accessibilité de l’offre')).toBeOnTheScreen()
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
