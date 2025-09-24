import React from 'react'

import {
  BookingsResponseV2,
  CategoryIdEnum,
  NativeCategoryIdEnumv2,
  SubcategoryIdEnum,
} from 'api/gen'
import { bookingsSnapV2 } from 'features/bookings/fixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render } from 'tests/utils/web'

import { EndedBookings } from './EndedBookings'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    resetSearch: jest.fn(),
  }),
}))

const mockUseSubcategoriesMapping = jest.fn()
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

jest.mock('libs/subcategories/mappings', () => ({
  useSubcategoriesMapping: jest.fn(() => mockUseSubcategoriesMapping()),
}))

describe('EndedBookings', () => {
  beforeEach(() => {
    mockServer.getApi<BookingsResponseV2>('/v2/bookings', bookingsSnapV2)

    setFeatureFlags()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<EndedBookings />))

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})
