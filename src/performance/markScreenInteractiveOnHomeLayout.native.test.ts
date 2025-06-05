import performance from 'react-native-performance'

import { markScreenInteractiveOnHomeLayout } from 'performance/markScreenInteractiveOnHomeLayout'

jest.mock('react-native-performance')

jest.useFakeTimers()

Object.defineProperty(global, '__DEV__', {
  value: false,
  writable: true,
})

describe('markScreenInteractiveOnHomeLayout', () => {
  it('should mark performance event when interactions are over', async () => {
    markScreenInteractiveOnHomeLayout('TabNavigator')
    await jest.runAllTimers()

    expect(performance.mark).toHaveBeenCalledTimes(1)
  })
})
