import React from 'react'

import { PriceLine } from 'features/bookOffer/components/PriceLine'
import { render, screen } from 'tests/utils'

describe('<PriceLine />', () => {
  it('should show total price', () => {
    render(<PriceLine unitPrice={500} quantity={1} />)

    expect(screen.getByTestId('price-line__total-price')).toHaveTextContent('5 €')
  })

  it('should show price details', () => {
    render(<PriceLine unitPrice={500} quantity={2} />)

    expect(screen.getByTestId('price-line__total-price')).toHaveTextContent('10 €')
    expect(screen.getByTestId('price-line__price-detail')).toHaveTextContent('(5 € x 2 places)')
  })

  it('should set default quantity to 1', () => {
    render(<PriceLine unitPrice={500} />)

    expect(screen.getByTestId('price-line__total-price')).toHaveTextContent('5 €')
    expect(screen.queryByTestId('price-line__price-detail')).not.toBeTruthy()
  })
})
