import type { ViewToken } from 'react-native'

import { useViewableItemsTracker } from 'shared/tracking/useViewableItemsTracker'
import { act, renderHook } from 'tests/utils'

const mockViewableItems: ViewToken[] = [
  { key: '1', index: 0, item: { id: 'a' }, isViewable: true },
  { key: '2', index: 1, item: { id: 'b' }, isViewable: true },
]

const expectedSimplifiedItems = [
  { key: '1', index: 0 },
  { key: '2', index: 1 },
]

const mockOnViewableItemsChanged = jest.fn()

describe('useViewableItemsTracker', () => {
  it('should execute simplified data function when callback defined', () => {
    const { result } = renderHook(() =>
      useViewableItemsTracker({
        onViewableItemsChanged: mockOnViewableItemsChanged,
      })
    )

    act(() => {
      result.current.handleViewableItemsChanged({ viewableItems: mockViewableItems })
    })

    expect(mockOnViewableItemsChanged).toHaveBeenNthCalledWith(1, expectedSimplifiedItems)
  })
})
