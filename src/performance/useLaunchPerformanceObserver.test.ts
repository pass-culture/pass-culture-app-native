import * as perf from '@react-native-firebase/perf'
import performance, { PerformanceObserver } from 'react-native-performance'

import { CustomMarks } from 'performance/CustomMarks'
import { useLaunchPerformanceObserver } from 'performance/useLaunchPerformanceObserver'
import { renderHook } from 'tests/utils'

const APP_START_TIME = 1748968544490
const APP_INTERACTIVE_TIME = APP_START_TIME + 30000

// Test 1:
const performanceObserverSpy = PerformanceObserver as jest.Mock

// Test 2:
const measureSpy = jest.spyOn(performance, 'measure')

// Test 3:
const mockTrace = {
  putMetric: jest.fn(),
  stop: jest.fn().mockResolvedValue(undefined),
}
const mockStartTrace = jest.fn().mockResolvedValue(mockTrace)

const mockPerfInstance = {
  startTrace: mockStartTrace,
}

jest.spyOn(perf, 'default').mockImplementation(() => mockPerfInstance)
// End test 3

jest.useFakeTimers()

describe('useLaunchPerformanceObserver', () => {
  beforeEach(() => {
    performance.clearMarks('nativeLaunchStart')
    performance.clearMarks(CustomMarks.SCREEN_INTERACTIVE)
  })

  it('should instantiate the observer', () => {
    const { unmount } = renderHook(() => useLaunchPerformanceObserver())

    SimulateAppStart()

    expect(performanceObserverSpy).toBeTruthy()

    unmount()
  })

  it('should call performance measure', () => {
    const { unmount } = renderHook(() => useLaunchPerformanceObserver())

    SimulateAppStart()

    expect(measureSpy).toHaveBeenCalledTimes(1)

    unmount()
  })

  it('should call send measure to firebase', () => {
    const { unmount } = renderHook(() => useLaunchPerformanceObserver())

    SimulateAppStart()

    expect(mockStartTrace).toHaveBeenCalledWith(3000)

    unmount()
  })
})

function SimulateAppStart() {
  performance.mark('nativeLaunchStart', { startTime: APP_START_TIME })

  jest.advanceTimersByTimeAsync(3000)

  performance.mark(CustomMarks.SCREEN_INTERACTIVE, { startTime: APP_INTERACTIVE_TIME })
}
