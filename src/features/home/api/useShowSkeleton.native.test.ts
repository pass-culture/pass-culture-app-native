import { ANIMATION_DELAY, useShowSkeleton } from 'features/home/api/useShowSkeleton'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

jest.useFakeTimers({ legacyFakeTimers: true })

describe('useShowSkeleton', () => {
  it('should show skeleton when fetching data on load', async () => {
    const { result, rerender } = renderHook(useShowSkeleton, {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(result.current).toBeTruthy()

    await act(async () => rerender(1))

    expect(result.current).toBeTruthy()

    await act(async () => {
      jest.advanceTimersByTime(ANIMATION_DELAY)
    })

    expect(result.current).toBeFalsy()
  })
})
