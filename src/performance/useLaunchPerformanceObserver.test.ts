import performance, { PerformanceObserver } from 'react-native-performance'
import * as performanceAPI from 'react-native-performance'

import { CustomMarks } from 'performance/CustomMarks'
import { useLaunchPerformanceObserver } from 'performance/useLaunchPerformanceObserver'
import { renderHook } from 'tests/utils'

const performanceObserverSpy = PerformanceObserver as jest.Mock

const measureSpy = performance.measure as jest.Mock

const getEntriesSpy = jest.spyOn(performanceAPI.default, 'getEntriesByName').mockReturnValue([
  {
    name: 'nativeLaunchStart',
    entryType: 'react-native-mark',
    startTime: 44947437,
    duration: 0,
  } as performanceAPI.PerformanceEntry,
  {
    name: 'screenInteractive',
    entryType: 'mark',
    duration: 0,
    startTime: 10,
  } as performanceAPI.PerformanceEntry,
  {
    name: 'timeToInteractive',
    entryType: 'measure',
    duration: 3500.5,
    startTime: 10,
  } as performanceAPI.PerformanceEntry,
])
console.log(getEntriesSpy.getEntriesByName)
// jest.useFakeTimers()

describe('useLaunchPerformanceObserver', () => {
  it('should instantiate the observer', () => {
    renderHook(() => useLaunchPerformanceObserver())

    expect(performanceObserverSpy).toBeTruthy()
  })

  it('should call performance measure', () => {
    renderHook(() => useLaunchPerformanceObserver())

    performance.mark(CustomMarks.SCREEN_INTERACTIVE)

    expect(measureSpy).toHaveBeenCalledTimes(1)
  })
})
