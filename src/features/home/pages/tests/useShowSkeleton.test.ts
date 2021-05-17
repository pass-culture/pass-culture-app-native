import { renderHook } from '@testing-library/react-hooks'

import { act } from 'tests/utils'

import { ANIMATION_DELAY, useShowSkeleton } from '../useShowSkeleton'

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
    await act(async () => await rerender())

    expect(result.current).toBeTruthy()
    await act(async () => {
      jest.advanceTimersByTime(ANIMATION_DELAY)
    })
    expect(result.current).toBeFalsy()
  })
})
