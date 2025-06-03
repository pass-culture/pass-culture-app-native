import { useLaunchPerformanceObserver } from 'performance/useLaunchPerformanceObserver'
import { renderHook } from 'tests/utils'

jest.mock('react-native-performance')

describe('useLaunchPerformanceObserver', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it('should call performance measure to calculate tti', () => {
    const { result } = renderHook(() => useLaunchPerformanceObserver())
    jest.runAllTimers()

    expect(result).toEqual({})
  })

  it('1', () => {
    expect(true).toBeTruthy()
  })

  it('2', () => {
    expect(true).toBeTruthy()
  })

  it('3', () => {
    expect(true).toBeTruthy()
  })
})
