import React from 'react'

import { offerResponseSnap } from 'features/offer/fixtures/offerResponse'
import { OfferPreview } from 'features/offerv2/pages/OfferPreview/OfferPreview'
import { render, screen } from 'tests/utils'

const mockOffer = jest.fn(() => ({
  data: offerResponseSnap,
}))

jest.mock('features/offer/api/useOffer', () => ({
  useOffer: () => mockOffer(),
}))

describe('<OfferPreview />', () => {
  it('should display offer preview page', () => {
    render(<OfferPreview />)

    expect(screen.getByText('1/1')).toBeOnTheScreen()
  })

  it('should not display offer preview page when there is not an image', () => {
    mockOffer.mockReturnValueOnce({
      data: { ...offerResponseSnap, image: null },
    })
    render(<OfferPreview />)

    expect(screen.queryByText('1/1')).not.toBeOnTheScreen()
  })
})
