import React from 'react'

import { OfferArtists } from 'features/offer/components/OfferArtists/OfferArtists'
import { render, screen } from 'tests/utils'

describe('<OfferArtists />', () => {
  it('should not display artists when it is null', () => {
    render(<OfferArtists artists={null} />)

    expect(screen.queryByText('de')).not.toBeOnTheScreen()
  })

  it('should display artists when it is not null', () => {
    render(<OfferArtists artists="Edith Piaf" />)

    expect(screen.getByText('de Edith Piaf')).toBeOnTheScreen()
  })
})
