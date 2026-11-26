import React from 'react'

import { PriceLine } from 'features/bookOffer/components/PriceLine'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { render, screen } from 'tests/utils'

const language = 'VOSTFR'

describe('<PriceLine />', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  it('should show total price', () => {
    render(<PriceLine unitPrice={500} quantity={1} />)

    expect(screen.getByText('5\u00a0€')).toBeOnTheScreen()
  })

  it('should show price details', () => {
    render(<PriceLine unitPrice={500} quantity={2} language={language} />)

    expect(screen.getByText('10\u00a0€')).toBeOnTheScreen()
    expect(screen.getByText('(5\u00a0€ x 2 places)')).toBeOnTheScreen()
  })

  it("should show cinema's language when offer has language", () => {
    render(<PriceLine unitPrice={500} quantity={2} language={language} />)

    expect(screen.getByText('- VOSTFR')).toBeOnTheScreen()
    expect(screen.getByTestId('price-line-price-detail')).toBeOnTheScreen()
    expect(screen.getByTestId('price-line-language')).toBeOnTheScreen()
  })

  it("should not show cinema's language when offer has not language", () => {
    render(<PriceLine unitPrice={500} quantity={2} />)

    expect(screen.queryByTestId('price-line-language')).not.toBeOnTheScreen()
  })

  it('should set default quantity to 1', () => {
    render(<PriceLine unitPrice={500} />)

    expect(screen.getByText('5\u00a0€')).toBeOnTheScreen()
    expect(screen.queryByTestId('price-line-price-detail')).not.toBeOnTheScreen()
  })
})
