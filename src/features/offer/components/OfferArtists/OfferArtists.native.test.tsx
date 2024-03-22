import React from 'react'

import { OfferArtists } from 'features/offer/components/OfferArtists/OfferArtists'
import { render, screen } from 'tests/utils'

describe('<OfferArtists />', () => {
  it('should display artists', () => {
    render(<OfferArtists artists="Edith Piaf" />)

    expect(screen.getByText('de Edith Piaf')).toBeOnTheScreen()
  })

  it('should display clickable artist button when param to display fake door activated', () => {
    render(<OfferArtists artists="Edith Piaf" shouldDisplayFakeDoor />)

    expect(screen.getByText('Edith Piaf')).toBeOnTheScreen()
  })

  it('should not display clickable artist button when param to display fake door deactivated', () => {
    render(<OfferArtists artists="Edith Piaf" />)

    expect(screen.queryByText('Edith Piaf')).not.toBeOnTheScreen()
  })
})
