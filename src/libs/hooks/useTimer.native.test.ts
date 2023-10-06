import { useTimer } from 'libs/hooks/useTimer'
import { renderHook, act } from 'tests/utils'

jest.useFakeTimers({ legacyFakeTimers: true })

describe('useTimer', () => {
  it('should decrease every second', async () => {
    const { result } = renderHook(() => useTimer(10))

    expect(result.current.timeLeft).toBe(10)

    await act(async () => {
      jest.advanceTimersByTime(1000)
    })

    expect(result.current.timeLeft).toBe(9)
  })
})
