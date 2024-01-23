import React from 'react'

import { OfferArtists } from 'features/offerv2/components/OfferArtists/OfferArtists'
import { render, screen } from 'tests/utils'

describe('<OfferArtists />', () => {
  it('should not display artists when it is undefined', () => {
    render(<OfferArtists artists={undefined} />)

    expect(screen.queryByText('de')).not.toBeOnTheScreen()
  })

  it('should display artists when it is defined', () => {
    render(<OfferArtists artists="Edith Piaf" />)

    expect(screen.getByText('de Edith Piaf')).toBeOnTheScreen()
  })
})
