import React from 'react'

import { PriceLine } from 'features/bookOffer/components/PriceLine'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, screen } from 'tests/utils'

const mockUseFeatureFlag = jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

const attributes = ['VOSTFR', '3D', 'IMAX']

describe('<PriceLine />', () => {
  it('should show total price', () => {
    render(<PriceLine unitPrice={500} quantity={1} />)

    expect(screen.getByText('5\u00a0€')).toBeOnTheScreen()
  })

  it('should show price details when wipAttributesCinemaOffers feature flag activated', () => {
    mockUseFeatureFlag.mockReturnValueOnce(true)
    render(<PriceLine unitPrice={500} quantity={2} attributes={attributes} />)

    expect(screen.getByText('10\u00a0€')).toBeOnTheScreen()
    expect(screen.getByText('(5\u00a0€ x 2 places)')).toBeOnTheScreen()
    expect(screen.getByText('- VOSTFR 3D IMAX')).toBeOnTheScreen()
    expect(screen.getByTestId('price-line__price-detail')).toBeOnTheScreen()
    expect(screen.getByTestId('price-line__attributes')).toBeOnTheScreen()
  })

  it("should not show cinema's attributes when wipAttributesCinemaOffers feature flag deactivated", () => {
    mockUseFeatureFlag.mockReturnValueOnce(false)
    render(<PriceLine unitPrice={500} quantity={2} attributes={attributes} />)

    expect(screen.queryByText('- VOSTFR 3D IMAX')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('price-line__attributes')).not.toBeOnTheScreen()
  })

  it('should set default quantity to 1', () => {
    render(<PriceLine unitPrice={500} />)

    expect(screen.getByText('5\u00a0€')).toBeOnTheScreen()
    expect(screen.queryByTestId('price-line__price-detail')).toBeNull()
  })
})
