import React from 'react'

import { OfferTags } from 'features/offer/components/OfferTags/OfferTags'
import { render, screen } from 'tests/utils'

const tags = ['Tag1', 'Tag2', 'Tag3']

describe('OfferTags component', () => {
  it('should display tags correctly', () => {
    render(<OfferTags tags={tags} />)

    expect(screen.getByText('Tag1')).toBeOnTheScreen()
    expect(screen.getByText('Tag2')).toBeOnTheScreen()
    expect(screen.getByText('Tag3')).toBeOnTheScreen()
  })
})
