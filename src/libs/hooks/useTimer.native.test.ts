import mockDate from 'mockdate'
import { AppState } from 'react-native'

import { useTimer } from 'libs/hooks/useTimer'
import { renderHook, act } from 'tests/utils'

jest.unmock('libs/appState')
const appStateSpy = jest.spyOn(AppState, 'addEventListener')

const currentDate = new Date('2023-10-05T12:00:00Z')

jest.useFakeTimers({ legacyFakeTimers: true })

describe('useTimer', () => {
  beforeEach(() => {
    mockDate.set(currentDate)
  })

  it('should decrease every second', async () => {
    const { result } = renderHook(() => useTimer(10))

    expect(result.current.timeLeft).toBe(10)

    await act(async () => {
      jest.advanceTimersByTime(1000)
    })

    expect(result.current.timeLeft).toBe(9)
  })

  it('should decrease by elapsed time when app is in background', async () => {
    const { result } = renderHook(() => useTimer(40))

    const mockCurrentAppState = appStateSpy.mock.calls[0][1]
    mockCurrentAppState('active')

    expect(result.current.timeLeft).toBe(40)

    await act(async () => {
      mockCurrentAppState('background')
      const elapsedTimeInMs = 30 * 1000
      mockDate.set(new Date(currentDate.getTime() + elapsedTimeInMs))
      mockCurrentAppState('active')
    })

    expect(result.current.timeLeft).toBe(10)
  })

  it('should set timer to 0 when app is in background for longer than remaining time', async () => {
    const { result } = renderHook(() => useTimer(40))

    const mockCurrentAppState = appStateSpy.mock.calls[0][1]
    mockCurrentAppState('active')

    expect(result.current.timeLeft).toBe(40)

    await act(async () => {
      mockCurrentAppState('background')
      const elapsedTimeInMs = 50 * 1000
      mockDate.set(new Date(currentDate.getTime() + elapsedTimeInMs))
      mockCurrentAppState('active')
    })

    expect(result.current.timeLeft).toBe(0)
  })
})
