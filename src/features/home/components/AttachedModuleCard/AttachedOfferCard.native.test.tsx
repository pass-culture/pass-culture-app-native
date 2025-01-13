import mockdate from 'mockdate'
import React from 'react'
import { UseQueryResult } from 'react-query'

import { SubcategoriesResponseModelv2 } from 'api/gen'
import { AttachedOfferCard } from 'features/home/components/AttachedModuleCard/AttachedOfferCard'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useDistance } from 'libs/location/hooks/useDistance'
import { ILocationContext, LocationMode } from 'libs/location/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { offersFixture } from 'shared/offer/offer.fixture'
import { render, screen } from 'tests/utils'

const offer = offersFixture[2]

const userNotLocated = {
  userLocation: undefined,
  selectedLocationMode: LocationMode.EVERYWHERE,
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
  data: PLACEHOLDER_DATA,
} as UseQueryResult<SubcategoriesResponseModelv2, unknown>)

mockdate.set(new Date('2019-12-01T00:00:00.000Z'))

jest.mock('libs/location/hooks/useDistance')
const mockUseDistance = useDistance as jest.Mock
mockUseDistance.mockReturnValue('10 km')

jest.mock('libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate')

describe('AttachedOfferCard', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
  })

  it('should display date if offer has one', () => {
    render(<AttachedOfferCard offer={offer} />)

    const date = screen.getByText(`17 novembre 2020`)

    expect(date).toBeOnTheScreen()
  })

  it('should display distance if offer and user has location', () => {
    render(<AttachedOfferCard offer={offer} />)

    const distance = screen.getByText(`à 10 km`)

    expect(distance).toBeOnTheScreen()
  })

  it('should display price if offer has one', () => {
    render(<AttachedOfferCard offer={offer} />)
    const price = screen.getByText('Dès 34 €')

    expect(price).toBeOnTheScreen()
  })

  it('should have accessibility label', () => {
    render(<AttachedOfferCard offer={offer} />)
    const accessibilityLabel = screen.getByLabelText(
      'Découvre l’offre exclusive "Un lit sous une rivière" de la catégorie "Concert". Date\u00a0: 17 novembre 2020. Prix\u00a0: Dès 34 €. Distance : à 10 km.'
    )

    expect(accessibilityLabel).toBeOnTheScreen()
  })
})
