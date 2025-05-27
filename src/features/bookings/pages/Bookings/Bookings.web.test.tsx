import { QueryObserverResult, UseQueryResult } from '@tanstack/react-query'
import React from 'react'

import {
  BookingsResponse,
  CategoryIdEnum,
  NativeCategoryIdEnumv2,
  SubcategoriesResponseModelv2,
  SubcategoryIdEnum,
} from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { useAvailableReactionQuery } from 'features/reactions/queries/useAvailableReactionQuery'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import * as bookingsAPI from 'queries/bookings/useBookingsQuery'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render } from 'tests/utils/web'

import { Bookings } from './Bookings'

jest.mock('libs/subcategories/useSubcategories')
const mockUseSubcategories = jest.mocked(useSubcategories)
mockUseSubcategories.mockReturnValue({
  isLoading: false,
} as UseQueryResult<SubcategoriesResponseModelv2, unknown>)

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    resetSearch: jest.fn(),
  }),
}))

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

jest.mock('libs/subcategories/useSubcategory')

const mockUseSubcategoriesMapping = jest.fn()
const mockUseCategoryIdMapping = jest.fn()
jest.mock('libs/subcategories/mappings', () => ({
  useSubcategoriesMapping: jest.fn(() => mockUseSubcategoriesMapping()),
  useCategoryIdMapping: jest.fn(() => mockUseSubcategoriesMapping()),
}))
mockUseSubcategoriesMapping.mockReturnValue({
  [SubcategoryIdEnum.SEANCE_CINE]: {
    isEvent: false,
    categoryId: CategoryIdEnum.CINEMA,
    nativeCategoryId: NativeCategoryIdEnumv2.SEANCES_DE_CINEMA,
  },
  [SubcategoryIdEnum.EVENEMENT_PATRIMOINE]: {
    isEvent: false,
    categoryId: CategoryIdEnum.CONFERENCE,
    nativeCategoryId: NativeCategoryIdEnumv2.EVENEMENTS_PATRIMOINE,
  },
})
mockUseCategoryIdMapping.mockReturnValue({
  [SubcategoryIdEnum.SEANCE_CINE]: CategoryIdEnum.FILM,
  [SubcategoryIdEnum.EVENEMENT_PATRIMOINE]: CategoryIdEnum.MUSEE,
})

jest.mock('features/reactions/queries/useAvailableReactionQuery')
const mockUseAvailableReaction = useAvailableReactionQuery as jest.Mock
mockUseAvailableReaction.mockReturnValue({
  data: { numberOfReactableBookings: 0, bookings: [] },
})

describe('Bookings', () => {
  beforeEach(() => {
    setFeatureFlags()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderBookings(bookingsSnap)

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})

const renderBookings = (bookings: BookingsResponse) => {
  jest
    .spyOn(bookingsAPI, 'useBookingsQuery')
    .mockReturnValue({ data: bookings, isFetching: false } as QueryObserverResult<
      BookingsResponse,
      unknown
    >)

  return render(reactQueryProviderHOC(<Bookings />))
}
