import { AppState } from 'react-native'

import { eventMonitoring } from 'libs/monitoring'
import { act, renderHook } from 'tests/utils'

import { useTrackDuration } from './useTrackDuration'

const appStateSpy = jest.spyOn(AppState, 'addEventListener')

describe('useTrackDuration', () => {
  const mockCallback = jest.fn()

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should return correct time interval with no background state', () => {
    const { result } = renderHook(() => useTrackDuration(mockCallback))

    const stop = result.current()
    jest.advanceTimersByTime(2000)

    stop()

    expect(mockCallback).toHaveBeenCalledWith(2)
  })

  it('should return correct time interval with background state in between', () => {
    const { result } = renderHook(() => useTrackDuration(mockCallback))

    const stop = result.current()
    jest.advanceTimersByTime(2000)

    // Simulate background state
    appStateSpy.mock.calls[0]?.[1]('background')
    jest.advanceTimersByTime(5000)
    appStateSpy.mock.calls[0]?.[1]('active')

    stop()

    expect(mockCallback).toHaveBeenCalledWith(2)
  })

  it('should return exception when time is negative', () => {
    const { result } = renderHook(() => useTrackDuration(mockCallback))

    // Simulate background state
    appStateSpy.mock.calls[0]?.[1]('inactive')
    jest.advanceTimersByTime(5000)
    appStateSpy.mock.calls[0]?.[1]('active')

    const stop = result.current()
    jest.advanceTimersByTime(2000)

    act(() => {
      stop()
    })

    expect(eventMonitoring.captureException).toHaveBeenCalledWith(
      'Error with useTrackDuration hook, duration calculated <= 0',
      expect.anything()
    )
  })
})
