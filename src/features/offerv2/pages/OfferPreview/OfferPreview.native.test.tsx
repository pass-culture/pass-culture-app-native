import React from 'react'

import { OfferPreview } from 'features/offerv2/pages/OfferPreview/OfferPreview'
import { render, screen } from 'tests/utils'

jest.mock('features/offer/api/useOffer')

describe('<OfferPreview />', () => {
  it('should display offer preview page', () => {
    render(<OfferPreview />)

    expect(screen.getByText('1/1')).toBeOnTheScreen()
  })
})
