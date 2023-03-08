import React from 'react'

import { PriceLine } from 'features/bookOffer/components/PriceLine'
import { render, screen } from 'tests/utils'

describe('<PriceLine />', () => {
  it('should show total price', () => {
    render(<PriceLine unitPrice={500} quantity={1} />)

    expect(screen.getByText('5\u00a0€')).toBeTruthy()
  })

  it('should show price details', () => {
    render(<PriceLine unitPrice={500} quantity={2} />)

    expect(screen.getByText('10\u00a0€')).toBeTruthy()
    expect(screen.getByText('(5\u00a0€ x 2 places)')).toBeTruthy()
    expect(screen.getByTestId('price-line__price-detail')).toBeTruthy()
  })

  it('should set default quantity to 1', () => {
    render(<PriceLine unitPrice={500} />)

    expect(screen.getByText('5\u00a0€')).toBeTruthy()
    expect(screen.queryByTestId('price-line__price-detail')).toBeNull()
  })
})
