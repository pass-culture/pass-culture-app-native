import React from 'react'

import { CategoryIdEnum, NativeCategoryIdEnumv2, SubcategoryIdEnum } from 'api/gen'
import { bookingsSnap } from 'features/bookings/fixtures/index'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render } from 'tests/utils/web'

import { EndedBookings } from './EndedBookings'

jest.mock('libs/firebase/analytics/analytics')

const mockBookings = { ...bookingsSnap }
jest.mock('queries/bookings/useBookingsQuery', () => ({
  useBookingsQuery: jest.fn(() => ({ data: mockBookings })),
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
    setFeatureFlags()
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(reactQueryProviderHOC(<EndedBookings />))

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
