import performance from 'react-native-performance'

import { markScreenInteractiveOnHomeLayout } from 'performance/markScreenInteractiveOnHomeLayout'

jest.mock('react-native-performance', () => {
  const mockPerformance = {
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByName: jest.fn((name) => {
      if (name === 'timeToInteractive') {
        return [{ name: name, duration: 3500.5, startTime: 10, entryType: 'measure' }]
      }
      // Return an empty array for any other entry name requested
      return []
    }),
  }
  // Export shape typically includes both default and named `performance`
  // Use __esModule: true to indicate it's an ES Module mock.
  return {
    __esModule: true,
    default: mockPerformance,
    performance: mockPerformance,
  }
})

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
