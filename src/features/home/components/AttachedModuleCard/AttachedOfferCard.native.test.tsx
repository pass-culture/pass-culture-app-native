import mockdate from 'mockdate'
import React from 'react'
import { UseQueryResult } from 'react-query'

import { SubcategoriesResponseModelv2 } from 'api/gen'
import { AttachedOfferCard } from 'features/home/components/AttachedModuleCard/AttachedOfferCard'
import { ILocationContext, LocationMode, Position } from 'libs/location/types'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { offersFixture } from 'shared/offer/offer.fixture'
import { render, screen } from 'tests/utils'

const offer = offersFixture[2]

const mockUserLocation: Position = { latitude: 2, longitude: 2 }
const mockUserSelectedLocation: LocationMode = LocationMode.AROUND_ME
const userNotLocated = {
  userLocation: undefined,
  selectedLocationMode: LocationMode.EVERYWHERE,
}
const userLocated = {
  userLocation: mockUserLocation,
  selectedLocationMode: mockUserSelectedLocation,
}

const mockUseLocation: jest.Mock<Partial<ILocationContext>> = jest.fn(() => userNotLocated)
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => mockUseLocation(),
}))

jest.mock('libs/subcategories/useSubcategory')
jest.mock('libs/subcategories/useCategoryId')
jest.mock('libs/subcategories/useSubcategories')
const mockUseSubcategories = jest.mocked(useSubcategories)
mockUseSubcategories.mockReturnValue({
  isLoading: false,
} as UseQueryResult<SubcategoriesResponseModelv2, unknown>)

mockdate.set(new Date('2019-12-01T00:00:00.000Z'))

describe('AttachedOfferCard', () => {
  it('should display date if offer has one', () => {
    render(<AttachedOfferCard offer={offer} />)

    const date = screen.getByText(`17 novembre 2020`)

    expect(date).toBeOnTheScreen()
  })

  it('should display distance if offer and user has location', () => {
    mockUseLocation.mockReturnValueOnce(userLocated)

    render(<AttachedOfferCard offer={offer} />)

    const distance = screen.getByText(`à 900+ km`)

    expect(distance).toBeOnTheScreen()
  })

  it('should display price if offer has one', () => {
    render(<AttachedOfferCard offer={offer} />)
    const price = screen.getByText('34 €')

    expect(price).toBeOnTheScreen()
  })
})
