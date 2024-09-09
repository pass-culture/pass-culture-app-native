import React from 'react'

import { CategoryIdEnum, NativeCategoryIdEnumv2, SubcategoryIdEnum } from 'api/gen'
import { useBookings } from 'features/bookings/api'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { useBookingsAwaitingReaction } from 'features/bookings/helpers/useBookingsAwaitingReaction'
import { RemoteConfigProvider } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const mockGetConfigValues = jest.fn()
jest.mock('libs/firebase/remoteConfig/remoteConfig.services', () => ({
  remoteConfig: {
    configure: () => Promise.resolve(true),
    refresh: () => Promise.resolve(true),
    getValues: () => mockGetConfigValues(),
  },
}))

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
  })),
}

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

describe('useBookingsAwaitingReaction', () => {
  beforeAll(() => {
    mockGetConfigValues.mockReturnValue({
      reactionCategories: { categories: ['SEANCES_DE_CINEMA'] },
    })
    mockUseBookings.mockReturnValue({ data: MOCK_BOOKINGS })
  })

  it('get bookings awaiting reactions count', async () => {
    const { result } = renderHook(() => useBookingsAwaitingReaction(), {
      wrapper: ({ children }) => (
        <RemoteConfigProvider>{reactQueryProviderHOC(children)}</RemoteConfigProvider>
      ),
    })
    await waitFor(() => expect(result.current).toBe(1))
  })
})
