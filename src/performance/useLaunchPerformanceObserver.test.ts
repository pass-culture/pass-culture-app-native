import * as perf from '@react-native-firebase/perf'
import performance from 'react-native-performance'

import { CustomMarks } from 'performance/CustomMarks'
import { useLaunchPerformanceObserver } from 'performance/useLaunchPerformanceObserver'
import { renderHook } from 'tests/utils'

jest.useFakeTimers()

const APP_START_TIME = 0
const FIRST_SCREEN_APPEARING_TIME = 3000
const TTI = FIRST_SCREEN_APPEARING_TIME - APP_START_TIME

Object.defineProperty(global, '__DEV__', {
  value: false,
  writable: true,
})

const mockPutMetric = jest.fn()
const mockTrace = {
  putMetric: mockPutMetric,
  stop: jest.fn().mockResolvedValue(undefined),
}

const mockPerf = jest.fn().mockReturnValue({ startTrace: jest.fn().mockResolvedValue(mockTrace) })
jest.spyOn(perf, 'default').mockImplementation(mockPerf)

describe('useLaunchPerformanceObserver', () => {
  it('should send the correct value to Firebase', async () => {
    renderHook(() => useLaunchPerformanceObserver())

    performance.mark('nativeLaunchStart', { startTime: APP_START_TIME })
    performance.mark(CustomMarks.SCREEN_INTERACTIVE, { startTime: FIRST_SCREEN_APPEARING_TIME })

    await jest.runAllTimers()

    expect(mockPutMetric).toHaveBeenCalledWith('time_to_interactive_in_ms', TTI)
  })
})
