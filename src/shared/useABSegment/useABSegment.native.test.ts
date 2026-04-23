import { env } from 'libs/environment/env'
import { abTestOverridesActions } from 'shared/useABSegment/abTestOverrideStore'
import * as SegmentFromIdentifier from 'shared/useABSegment/getSegmentFromIdentifier'
import { useABSegment } from 'shared/useABSegment/useABSegment'
import { act, renderHook } from 'tests/utils'

const mockUseAuthContext = jest.fn()
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))

const mockUseDeviceInfo = jest.fn().mockReturnValue({
  deviceId: 'device-id',
  os: 'iOS',
  resolution: '1080x1920',
  source: 'iPhone 13',
  screenZoomLevel: undefined,
  fontScale: 1.5,
})
jest.mock('features/trustedDevice/helpers/useDeviceInfo', () => ({
  useDeviceInfo: () => mockUseDeviceInfo(),
}))

jest.mock('shared/useABSegment/abTestRegistry', () => ({
  getABTestById: (id: string) => {
    if (id === 'my-test') {
      return {
        id: 'my-test',
        label: 'My Test',
        segments: ['A', 'B'],
      }
    }
    return undefined
  },
}))

const getSegmentFromIdentifierSpy = jest.spyOn(SegmentFromIdentifier, 'getSegmentFromIdentifier')

describe('useABSegment', () => {
  beforeEach(() => {
    mockUseAuthContext.mockReturnValue({ user: undefined })
    act(() => {
      abTestOverridesActions.resetAll()
    })
  })

  it('should return the forced segment when an override is set and env is not production', () => {
    act(() => {
      abTestOverridesActions.setOverride('my-test', 'B')
    })

    const { result } = renderHook(() => useABSegment('my-test'))

    expect(result.current).toBe('B')
  })

  it('should fall back to the deterministic segment when no override is set', () => {
    const { result } = renderHook(() => useABSegment('my-test'))

    expect(getSegmentFromIdentifierSpy).toHaveBeenLastCalledWith(['A', 'B'], 'device-id')
    expect(['A', 'B']).toContain(result.current)
  })

  it('should fall back to the deterministic segment when the forced segment is not in the segments list', () => {
    act(() => {
      abTestOverridesActions.setOverride('my-test', 'Z')
    })

    renderHook(() => useABSegment('my-test'))

    expect(getSegmentFromIdentifierSpy).toHaveBeenLastCalledWith(['A', 'B'], 'device-id')
  })

  it('should ignore the override in production', () => {
    const originalEnv = env.ENV
    env.ENV = 'production'
    act(() => {
      abTestOverridesActions.setOverride('my-test', 'B')
    })

    renderHook(() => useABSegment('my-test'))

    expect(getSegmentFromIdentifierSpy).toHaveBeenLastCalledWith(['A', 'B'], 'device-id')

    env.ENV = originalEnv
  })
})
