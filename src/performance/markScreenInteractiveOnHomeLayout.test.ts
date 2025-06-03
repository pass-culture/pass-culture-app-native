import performance from 'react-native-performance'

import { markScreenInteractiveOnHomeLayout } from 'performance/markScreenInteractiveOnHomeLayout'

jest.mock('react-native-performance')

describe('markScreenInteractiveOnHomeLayout', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  it('should mark performance event when interactions are over', () => {
    markScreenInteractiveOnHomeLayout()
    jest.runAllTimers()

    expect(performance.mark).toHaveBeenCalledTimes(1)
  })
})
