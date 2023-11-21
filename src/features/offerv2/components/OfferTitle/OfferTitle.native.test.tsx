import React from 'react'

import { OfferTitle } from 'features/offerv2/components/OfferTitle/OfferTitle'
import { render, screen } from 'tests/utils'

describe('OfferTitle', () => {
  it('should display title correctly', () => {
    render(<OfferTitle offerName="Le Roi Lion" />)

    expect(screen.getByText('Le Roi Lion')).toBeOnTheScreen()
  })
})
