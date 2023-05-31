import React from 'react'

import { BookingOfferLoader } from 'features/bookOffer/components/BookingOfferLoader/BookingOfferLoader'
import { render, screen } from 'tests/utils'

describe('BookingOfferLoader', () => {
  it('should display the message use in parameter', () => {
    render(<BookingOfferLoader message="En cours de chargement..." />)
    expect(screen.getByText('En cours de chargement...')).toBeTruthy()
  })
})
