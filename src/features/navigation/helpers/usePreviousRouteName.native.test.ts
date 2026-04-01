import { useNavigationState } from '__mocks__/@react-navigation/native'
import { renderHook } from 'tests/utils'

import { usePreviousRouteName } from './usePreviousRouteName'

describe('usePreviousRoute', () => {
  it('should return the previous route when there is more than one route in the stack', () => {
    useNavigationState.mockImplementationOnce((selector) =>
      selector({
        index: 1,
        routes: [{ name: 'Home' }, { name: 'Settings' }],
      })
    )

    const { result } = renderHook(() => usePreviousRouteName())

    expect(result.current).toBe('Home')
  })

  it('should return null when on the first route of the stack', () => {
    useNavigationState.mockImplementationOnce((selector) =>
      selector({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    )

    const { result } = renderHook(() => usePreviousRouteName())

    expect(result.current).toBeNull()
  })

  it('should return null when the navigation state is empty', () => {
    useNavigationState.mockImplementationOnce((selector) =>
      selector({
        index: -1,
        routes: [],
      })
    )

    const { result } = renderHook(() => usePreviousRouteName())

    expect(result.current).toBeNull()
  })
})
