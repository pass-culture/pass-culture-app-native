import { availableReactionsSnap } from 'features/bookings/fixtures/availableReactionSnap'
import { useTabBarItemBadges } from 'features/navigation/helpers/useTabBarItemBadges'
import { renderHook } from 'tests/utils'

const mockAvailableReactionsSnap = availableReactionsSnap

jest.mock('features/reactions/api/useAvailableReaction', () => ({
  useAvailableReaction: jest.fn(() => ({
    data: mockAvailableReactionsSnap,
  })),
}))

describe('useTabBarItemBadges', () => {
  it('should return badges by route', () => {
    const { result } = renderHook(() => useTabBarItemBadges())

    expect(result.current.Bookings).toEqual(2)
  })
})
