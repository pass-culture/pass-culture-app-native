import { ANIMATION_DELAY, useShowSkeleton } from 'features/home/api/useShowSkeleton'
import { act, renderHook } from 'tests/utils'

jest.mock('react-query', () => ({
  useIsFetching: jest.fn(() => 0).mockImplementationOnce(() => 1),
  useQueryClient: jest
    .fn(() => ({
      getQueryCache: jest.fn(() => ({
        findAll: jest.fn(() => [{ state: { isFetching: false } }]),
      })),
    }))
    .mockImplementationOnce(() => ({
      getQueryCache: jest.fn(() => ({
        findAll: jest.fn(() => [{ state: { isFetching: true } }]),
      })),
    })),
}))

describe('useShowSkeleton', () => {
  it('should show skeleton when fetching data on load', async () => {
    jest.useFakeTimers()
    const { result, rerender } = renderHook(useShowSkeleton)

    expect(result.current).toBeTruthy()
    await act(async () => await rerender(1))

    expect(result.current).toBeTruthy()
    await act(async () => {
      jest.advanceTimersByTime(ANIMATION_DELAY)
    })
    expect(result.current).toBeFalsy()
  })
})
