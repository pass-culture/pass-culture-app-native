import { useIsFetching } from '@tanstack/react-query'

import { useShowSkeleton } from 'features/home/api/useShowSkeleton'
import { renderHook } from 'tests/utils'

jest.mock('@tanstack/react-query', () => ({
  useIsFetching: jest.fn(),
}))

const mockedUseIsFetching = useIsFetching as jest.Mock

describe('useShowSkeleton', () => {
  it('should return true when is fetching home module', () => {
    mockedUseIsFetching.mockReturnValueOnce(1) // HOME_MODULE

    const { result } = renderHook(() => useShowSkeleton())

    expect(result.current).toEqual(true)
  })

  it('should return false once all queries have finished fetching', async () => {
    mockedUseIsFetching.mockReturnValueOnce(0) // HOME_MODULE

    const { result } = renderHook(() => useShowSkeleton())

    expect(result.current).toEqual(false)
  })
})
