import { renderHook } from '@testing-library/react-hooks'

import { act } from 'tests/utils'

import { SKELETON_DELAY, useShowSkeleton } from '../useShowSkeleton'

describe('useShowSkeleton', () => {
  it('should show skeleton after animation delay', async () => {
    jest.useFakeTimers()
    const { result, rerender } = renderHook(() => useShowSkeleton(true))

    expect(result.current).toBeTruthy()
    await act(async () => await rerender())

    expect(result.current).toBeTruthy()
    await act(async () => {
      jest.advanceTimersByTime(SKELETON_DELAY)
    })
    expect(result.current).toBeFalsy()
  })
})
