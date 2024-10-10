import React from 'react'

import { render, screen } from 'tests/utils'

import { OfferEventCardListSkeleton } from './OfferEventCardListSkeleton'

describe('OfferEventCardListSkeleton', () => {
  it('renders a container view', () => {
    render(<OfferEventCardListSkeleton />)

    const container = screen.getByTestId('offer-event-card-list-skeleton-container')

    expect(container).toBeTruthy()
  })
})
