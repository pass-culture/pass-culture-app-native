import React from 'react'

import { CategoryIdEnum, NativeCategoryIdEnumv2, SubcategoryIdEnum } from 'api/gen'
import { useBookings } from 'features/bookings/api'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { useBookingsAwaitingReaction } from 'features/bookings/helpers/useBookingsAwaitingReaction'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import * as useRemoteConfigContext from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { RemoteConfigProvider } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
const useRemoteConfigContextSpy = jest.spyOn(useRemoteConfigContext, 'useRemoteConfigContext')

jest.mock('features/bookings/api')
const mockUseBookings = useBookings as jest.Mock

const mockUseSubcategoriesMapping = jest.fn()
jest.mock('libs/subcategories/mappings', () => ({
  useSubcategoriesMapping: jest.fn(() => mockUseSubcategoriesMapping()),
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

const MOCK_BOOKINGS = {
  ...bookingsSnap,
  ended_bookings: bookingsSnap.ended_bookings.map((booking) => ({
    ...booking,
    userReaction: null,
    cancellationDate: null,
  })),
}

const MOCK_CANCELLED_BOOKINGS = {
  ...bookingsSnap,
  ended_bookings: bookingsSnap.ended_bookings.map((booking) => ({
    ...booking,
    userReaction: null,
    cancellationDate: '2021-03-15T23:01:37.925926',
  })),
}

describe('useBookingsAwaitingReaction', () => {
  beforeAll(() => {
    useRemoteConfigContextSpy.mockReturnValue({
      ...DEFAULT_REMOTE_CONFIG,
      reactionCategories: { categories: [NativeCategoryIdEnumv2.SEANCES_DE_CINEMA] },
    })
  })

  it('should return bookings awaiting reactions count without cancelled booking', () => {
    mockUseBookings.mockReturnValueOnce({ data: MOCK_BOOKINGS })
    const { result } = renderHook(() => useBookingsAwaitingReaction(), {
      wrapper: ({ children }) => (
        <RemoteConfigProvider>{reactQueryProviderHOC(children)}</RemoteConfigProvider>
      ),
    })

    expect(result.current).toBe(1)
  })

  it('should return 0 when booking is cancelled and without reaction', () => {
    mockUseBookings.mockReturnValueOnce({ data: MOCK_CANCELLED_BOOKINGS })
    const { result } = renderHook(() => useBookingsAwaitingReaction(), {
      wrapper: ({ children }) => (
        <RemoteConfigProvider>{reactQueryProviderHOC(children)}</RemoteConfigProvider>
      ),
    })

    expect(result.current).toBe(0)
  })
})
