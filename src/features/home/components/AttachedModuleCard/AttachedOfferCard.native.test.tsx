import { UseQueryResult } from '@tanstack/react-query'
import mockdate from 'mockdate'
import React from 'react'

import { SubcategoriesResponseModelv2 } from 'api/gen'
import { AttachedOfferCard } from 'features/home/components/AttachedModuleCard/AttachedOfferCard'
import { LocationMode } from 'libs/location/types'
import {
  defaultLocationState,
  locationActions,
  useLocationV2,
} from 'libs/locationV2/location.store'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { useSubcategoriesQuery } from 'queries/subcategories/useSubcategoriesQuery'
import { offersFixture } from 'shared/offer/offer.fixture'
import { render, screen } from 'tests/utils'

const offer = offersFixture[2]

const DEFAULT_USER_LOCATION = { latitude: 4, longitude: -52 }

jest.mock('libs/subcategories/useSubcategory')
jest.mock('libs/subcategories/useCategoryId')
jest.mock('queries/subcategories/useSubcategoriesQuery')
const mockUseSubcategories = jest.mocked(useSubcategoriesQuery)
mockUseSubcategories.mockReturnValue({
  isLoading: false,
  data: PLACEHOLDER_DATA,
} as UseQueryResult<SubcategoriesResponseModelv2, Error>)

mockdate.set(new Date('2019-12-01T00:00:00.000Z'))

describe('AttachedOfferCard', () => {
  beforeEach(() => {
    useLocationV2.setState(defaultLocationState)
  })

  it('should display date if offer has one', () => {
    render(<AttachedOfferCard offer={offer} />)

    const date = screen.getByText(`17 novembre 2020`)

    expect(date).toBeOnTheScreen()
  })

  it('should display distance if offer and user has location', () => {
    locationActions.setGeolocPosition(DEFAULT_USER_LOCATION)
    locationActions.setLocationMode(LocationMode.AROUND_ME)
    render(<AttachedOfferCard offer={offer} />)

    const distance = screen.getByText('à 107 km')

    expect(distance).toBeOnTheScreen()
  })

  it('should display price if offer has one', () => {
    render(<AttachedOfferCard offer={offer} />)

    const price = screen.getByText('34 €')

    expect(price).toBeOnTheScreen()
  })

  it('should display bottomBannerText if offer has one', () => {
    render(<AttachedOfferCard offer={offer} comingSoon="Disponible le 17 février" />)

    const comingSoon = screen.getByText('Disponible le 17 février')

    expect(comingSoon).toBeOnTheScreen()
  })

  it('should have accessibility label', () => {
    locationActions.setGeolocPosition(DEFAULT_USER_LOCATION)
    locationActions.setLocationMode(LocationMode.AROUND_ME)
    render(<AttachedOfferCard offer={offer} />)
    const accessibilityLabel = screen.getByLabelText(
      'Un lit sous une rivière - Concert - 17 novembre 2020 - 34 € - à 107 km'
    )

    expect(accessibilityLabel).toBeOnTheScreen()
  })
})
