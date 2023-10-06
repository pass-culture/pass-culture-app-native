import React from 'react'

import { PriceLine } from 'features/bookOffer/components/PriceLine'
import { render, screen } from 'tests/utils'

const attributes = ['VOSTFR', '3D', 'IMAX']

describe('<PriceLine />', () => {
  it('should show total price', () => {
    render(<PriceLine unitPrice={500} quantity={1} />)

    expect(screen.getByText('5\u00a0€')).toBeOnTheScreen()
  })

  it('should show price details', () => {
    render(<PriceLine unitPrice={500} quantity={2} attributes={attributes} />)

    expect(screen.getByText('10\u00a0€')).toBeOnTheScreen()
    expect(screen.getByText('(5\u00a0€ x 2 places)')).toBeOnTheScreen()
  })

  it("should show cinema's attributes when offer has attributes", () => {
    render(<PriceLine unitPrice={500} quantity={2} attributes={attributes} />)

    expect(screen.getByText('- VOSTFR 3D IMAX')).toBeOnTheScreen()
    expect(screen.getByTestId('price-line__price-detail')).toBeOnTheScreen()
    expect(screen.getByTestId('price-line__attributes')).toBeOnTheScreen()
  })

  it("should not show cinema's attributes when offer has not attributes", () => {
    render(<PriceLine unitPrice={500} quantity={2} attributes={[]} />)

    expect(screen.queryByTestId('price-line__attributes')).not.toBeOnTheScreen()
  })

  it('should set default quantity to 1', () => {
    render(<PriceLine unitPrice={500} />)

    expect(screen.getByText('5\u00a0€')).toBeOnTheScreen()
    expect(screen.queryByTestId('price-line__price-detail')).not.toBeOnTheScreen()
  })
})
