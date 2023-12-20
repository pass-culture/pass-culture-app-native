import React from 'react'

import { OfferMetadataItem } from 'features/offerv2/components/OfferMetadataItem/OfferMetadataItem'
import { render, screen } from 'tests/utils'

describe('<OfferMetadataItem />', () => {
  it('should display metadata label', () => {
    render(<OfferMetadataItem label="Intervenant" value="Jean Paul Sartre" />)

    expect(screen.getByText('Intervenant :')).toBeOnTheScreen()
  })

  it('should display metadata value', () => {
    render(<OfferMetadataItem label="Intervenant" value="Jean Paul Sartre" />)

    expect(screen.getByText('Jean Paul Sartre')).toBeOnTheScreen()
  })
})
