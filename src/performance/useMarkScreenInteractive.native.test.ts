import performance from 'react-native-performance'

import { performanceMonitoringStoreActions } from 'features/home/pages/helpers/usePerformanceMonitoringStore'
import { useMarkScreenInteractive } from 'performance/useMarkScreenInteractive'
import { act, renderHook } from 'tests/utils'

jest.mock('react-native-performance')

jest.useFakeTimers()

Object.defineProperty(global, '__DEV__', {
  value: false,
  writable: true,
})

describe('useMarkScreenInteractive', () => {
  it('should mark performance event when interactions are over', () => {
    performanceMonitoringStoreActions.setInitialScreenName('TabNavigator')
    renderHook(() => useMarkScreenInteractive())
    act(() => {
      jest.runAllTimers()
    })

    expect(performance.mark).toHaveBeenCalledTimes(1)
  })
})
