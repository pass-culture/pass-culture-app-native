import { renderHook } from '@testing-library/react-hooks'
import { act } from '@testing-library/react-native'
import { QueryCache } from 'react-query'

import { DEFAULT_SPLASHSCREEN_DELAY } from 'libs/splashscreen'

import { ANIMATION_DELAY, hasFetchedSubmodules, useShowSkeleton } from './useShowSkeleton'

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

describe('hasFetchedSubmodules', () => {
  it('should return false if has not started fetching modules', () => {
    const result = hasFetchedSubmodules(({ findAll: jest.fn(() => []) } as unknown) as QueryCache)
    expect(result).toBeFalsy()
  })
  it('should return false if it is still fetching modules', () => {
    const result = hasFetchedSubmodules(({
      findAll: jest.fn(() => [{ state: { isFetching: false } }, { state: { isFetching: true } }]),
    } as unknown) as QueryCache)
    expect(result).toBeFalsy()
  })
  it('should return true if all modules have been fetched', () => {
    const result = hasFetchedSubmodules(({
      findAll: jest.fn(() => [{ state: { isFetching: false } }, { state: { isFetching: false } }]),
    } as unknown) as QueryCache)
    expect(result).toBeTruthy()
  })
})

describe('useShowSkeleton', () => {
  it('should show skeleton when fetching data on load', async () => {
    jest.useFakeTimers()
    const { result, rerender } = renderHook(useShowSkeleton)

    expect(result.current).toBeTruthy()
    await act(async () => await rerender())

    expect(result.current).toBeTruthy()
    await act(async () => {
      jest.advanceTimersByTime(DEFAULT_SPLASHSCREEN_DELAY)
    })
    expect(result.current).toBeTruthy()
    await act(async () => {
      jest.advanceTimersByTime(ANIMATION_DELAY)
    })
    expect(result.current).toBeFalsy()
  })
})
