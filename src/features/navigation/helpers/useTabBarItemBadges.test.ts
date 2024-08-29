import { useTabBarItemBadges } from 'features/navigation/helpers/useTabBarItemBadges'
import { renderHook } from 'tests/utils'

jest.mock('features/bookings/helpers/useBookingsAwaitingReaction', () => ({
  useBookingsAwaitingReaction: () => 10,
}))

describe('useTabBarItemBadges', () => {
  it('should return badges by route', () => {
    const { result } = renderHook(() => useTabBarItemBadges())

    expect(result.current.Bookings).toBe(10)
  })
})
