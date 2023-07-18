import React from 'react'

import { PriceLine } from 'features/bookOffer/components/PriceLine'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, screen } from 'tests/utils'

const mockUseFeatureFlag = jest.spyOn(useFeatureFlag, 'useFeatureFlag')

const attributes = ['VOSTFR', '3D', 'IMAX']

describe('<PriceLine />', () => {
  it('should show total price', () => {
    render(<PriceLine unitPrice={500} quantity={1} />)

    expect(screen.getByText('5\u00a0€')).toBeTruthy()
  })

  it('should show price details when wipAttributesCinemaOffers feature flag activated', () => {
    mockUseFeatureFlag.mockReturnValueOnce(true)
    render(<PriceLine unitPrice={500} quantity={2} attributes={attributes} />)

    expect(screen.getByText('10\u00a0€')).toBeTruthy()
    expect(screen.getByText('(5\u00a0€ x 2 places)')).toBeTruthy()
    expect(screen.getByText('- VOSTFR 3D IMAX')).toBeTruthy()
    expect(screen.getByTestId('price-line__price-detail')).toBeTruthy()
    expect(screen.getByTestId('price-line__attributes')).toBeTruthy()
  })

  it("should not show cinema's attributes when wipAttributesCinemaOffers feature flag deactivated", () => {
    mockUseFeatureFlag.mockReturnValueOnce(false)
    render(<PriceLine unitPrice={500} quantity={2} attributes={attributes} />)

    expect(screen.queryByText('- VOSTFR 3D IMAX')).toBeFalsy()
    expect(screen.queryByTestId('price-line__attributes')).toBeFalsy()
  })

  it('should set default quantity to 1', () => {
    render(<PriceLine unitPrice={500} />)

    expect(screen.getByText('5\u00a0€')).toBeTruthy()
    expect(screen.queryByTestId('price-line__price-detail')).toBeNull()
  })
})
