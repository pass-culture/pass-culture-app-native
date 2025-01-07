import { availableReactionsSnap } from 'features/bookings/fixtures/availableReactionSnap'
import { useTabBarItemBadges } from 'features/navigation/helpers/useTabBarItemBadges'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook } from 'tests/utils'

const mockAvailableReactionsSnap = availableReactionsSnap

jest.mock('features/reactions/api/useAvailableReaction', () => ({
  useAvailableReaction: jest.fn(() => ({
    data: mockAvailableReactionsSnap,
  })),
}))

describe('useTabBarItemBadges', () => {
  it('should return badges by route', () => {
    const { result } = renderHook(() => useTabBarItemBadges(), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(result.current.Bookings).toEqual(2)
  })
})
