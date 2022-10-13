import * as Dates from 'libs/dates'
import * as Timer from 'libs/timer'
import { act, renderHook } from 'tests/utils'

describe('Timer', () => {
  describe('Undefined start time', () => {
    jest.useFakeTimers()

    it.each([0, null, undefined])('should not start timer on nil starttime (%s)', (starttime) => {
      renderHook(() => Timer.useTimer(starttime, () => false))

      expect(setInterval).not.toBeCalled()
    })
  })

  describe('Stop condition', () => {
    let clearLocalIntervalMock: jest.SpyInstance<void, Array<NodeJS.Timeout | null>>

    beforeEach(() => {
      clearLocalIntervalMock = jest
        .spyOn(Timer, 'clearLocalInterval')
        .mockImplementation(() => null)
    })
    afterEach(jest.restoreAllMocks)

    it('should stop if shouldStop return true', () => {
      renderHook(() => Timer.useTimer(1, () => true))

      jest.runOnlyPendingTimers()

      expect(clearLocalIntervalMock).toBeCalled()
    })
    it('should not stop if shouldStop return false', () => {
      jest.useFakeTimers()
      // eslint-disable-next-line local-rules/independent-mocks
      jest.spyOn(Dates, 'currentTimestamp').mockReturnValue(1)
      const myInspector = jest.fn((_elapstedTime: number) => false)
      renderHook(() => Timer.useTimer(1, myInspector))

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      expect(clearLocalIntervalMock).not.toBeCalled()
      // expect call with the result of currentTimestamp()-timer = 1 - 1 = 0
      expect(myInspector).toBeCalledWith(0)
    })
  })

  describe('onSecondTick', () => {
    it('should call onSecondTick when supplied', () => {
      const onSecondTick = jest.fn()
      const {
        result: { current },
      } = renderHook(() => Timer.useTimer(Dates.currentTimestamp() - 1, () => false, onSecondTick))
      jest.runOnlyPendingTimers()
      expect(onSecondTick).toBeCalledWith(1)
      expect(current).toEqual(Timer.TIMER_NOT_INITIALIZED)
    })
    it('should not call onSecondTick when not supplied', () => {
      jest.useFakeTimers()
      const {
        result: { current },
      } = renderHook(() => Timer.useTimer(Dates.currentTimestamp() - 1, () => false))
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      expect(current).toEqual(Timer.TIMER_NOT_INITIALIZED)
    })
  })
})
