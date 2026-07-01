import { UseQueryResult } from '@tanstack/react-query'
import mockdate from 'mockdate'
import React from 'react'

import { SubcategoriesResponseModelv2 } from 'api/gen'
import { AttachedOfferCard } from 'features/home/components/AttachedModuleCard/AttachedOfferCard'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { UseLocationReturnType, LocationMode } from 'libs/location/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { useSubcategoriesQuery } from 'queries/subcategories/useSubcategoriesQuery'
import { offersFixture } from 'shared/offer/offer.fixture'
import { render, screen } from 'tests/utils'

const useRemoteConfigSpy = jest
  .spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')
  .mockReturnValue(remoteConfigResponseFixture)

const offer = offersFixture[2]

const DEFAULT_USER_LOCATION = { latitude: 4, longitude: -52 }

const EVERYWHERE_USER_POSITION = {
  userLocation: null,
  selectedPlace: null,
  selectedLocationMode: LocationMode.EVERYWHERE,
  geolocPosition: undefined,
}

const AROUND_ME_POSITION = {
  userLocation: DEFAULT_USER_LOCATION,
  selectedPlace: null,
  selectedLocationMode: LocationMode.AROUND_ME,
  geolocPosition: DEFAULT_USER_LOCATION,
  place: null,
}

const mockUseLocation: jest.Mock<Partial<UseLocationReturnType>> = jest.fn(
  () => EVERYWHERE_USER_POSITION
)
jest.mock('libs/location/useLocation', () => ({
  useLocation: () => mockUseLocation(),
}))

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
    useRemoteConfigSpy.mockReturnValue({
      ...remoteConfigResponseFixture,
      data: {
        ...DEFAULT_REMOTE_CONFIG,
        shouldLogInfo: true,
      },
    })
  })

  it('should display date if offer has one', () => {
    render(<AttachedOfferCard offer={offer} />)

    const date = screen.getByText(`17 novembre 2020`)

    expect(date).toBeOnTheScreen()
  })

  it('should display distance if offer and user has location', () => {
    mockUseLocation.mockReturnValueOnce(AROUND_ME_POSITION)
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
    mockUseLocation.mockReturnValueOnce(AROUND_ME_POSITION)
    render(<AttachedOfferCard offer={offer} />)
    const accessibilityLabel = screen.getByLabelText(
      'Un lit sous une rivière - Concert - 17 novembre 2020 - 34 € - à 107 km'
    )

    expect(accessibilityLabel).toBeOnTheScreen()
  })
})
