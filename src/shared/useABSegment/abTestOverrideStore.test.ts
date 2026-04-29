import {
  abTestOverridesActions,
  useForcedCount,
  useOverride,
  useOverrides,
} from 'shared/useABSegment/abTestOverrideStore'
import { renderHook } from 'tests/utils'

describe('abTestOverrideStore', () => {
  beforeEach(() => {
    abTestOverridesActions.resetAll()
  })

  it('should return undefined when no override is set', () => {
    const { result } = renderHook(() => useOverride('unknown-test'))

    expect(result.current).toBeUndefined()
  })

  it('should set and read an override', () => {
    abTestOverridesActions.setOverride('test-a', 'B')

    const { result } = renderHook(() => useOverride('test-a'))

    expect(result.current).toBe('B')
  })

  it('should overwrite an existing override', () => {
    abTestOverridesActions.setOverride('test-a', 'A')
    abTestOverridesActions.setOverride('test-a', 'B')

    const { result } = renderHook(() => useOverride('test-a'))

    expect(result.current).toBe('B')
  })

  it('should remove an override when segment is null', () => {
    abTestOverridesActions.setOverride('test-a', 'A')
    abTestOverridesActions.setOverride('test-a', null)

    const { result } = renderHook(() => useOverride('test-a'))

    expect(result.current).toBeUndefined()
  })

  it('should expose the total forced count', () => {
    abTestOverridesActions.setOverride('test-a', 'A')
    abTestOverridesActions.setOverride('test-b', 'B')

    const { result } = renderHook(() => useForcedCount())

    expect(result.current).toBe(2)
  })

  it('resetAll should clear every override', () => {
    abTestOverridesActions.setOverride('test-a', 'A')
    abTestOverridesActions.setOverride('test-b', 'B')
    abTestOverridesActions.resetAll()

    const { result } = renderHook(() => useOverrides())

    expect(result.current).toEqual({})
  })
})
