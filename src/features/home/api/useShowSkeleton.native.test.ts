import { ANIMATION_DELAY, useShowSkeleton } from 'features/home/api/useShowSkeleton'
import { act, renderHook } from 'tests/utils'

jest.useFakeTimers()

describe('useShowSkeleton', () => {
  it('should show skeleton when fetching data on load', async () => {
    const { result, rerender } = renderHook(useShowSkeleton)

    expect(result.current).toBeTruthy()

    await act(async () => rerender(1))

    expect(result.current).toBeTruthy()

    await act(async () => {
      jest.advanceTimersByTime(ANIMATION_DELAY)
    })

    expect(result.current).toBeFalsy()
  })
})
