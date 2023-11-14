import React from 'react'

import { OfferPrice } from 'features/offerv2/components/OfferPrice/OfferPrice'
import { render, screen } from 'tests/utils'

describe('<OfferPrice />', () => {
  it('should display correctly round price', () => {
    render(<OfferPrice prices={[1000]} />)

    expect(screen.queryByText('10,00\u00a0€')).toBeOnTheScreen()
  })

  it('should display correctly decimal price', () => {
    render(<OfferPrice prices={[999]} />)

    expect(screen.queryByText('9,99\u00a0€')).toBeOnTheScreen()
  })

  it('should display "Gratuit" when price is 0', () => {
    render(<OfferPrice prices={[0]} />)

    expect(screen.queryByText('Gratuit')).toBeOnTheScreen()
  })

  it('should display "Dès" with the minimal price when there are several prices', () => {
    render(<OfferPrice prices={[1000, 500]} />)

    expect(screen.queryByText('Dès 5,00\u00a0€')).toBeOnTheScreen()
  })
})
