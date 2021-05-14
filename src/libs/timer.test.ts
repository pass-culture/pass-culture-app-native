import { renderHook } from '@testing-library/react-hooks'

import * as Dates from 'libs/dates'
import * as Timer from 'libs/timer'

describe('Timer', () => {
  describe('Undefined start time', () => {
    jest.useFakeTimers()

    it.each([0, null, undefined])('should not start timer on nil starttime (%s)', (starttime) => {
      renderHook(() => Timer.useTimer(starttime, () => false))

      expect(setInterval).not.toBeCalled()
    })
  })

  describe('Stop condition', () => {
    let clearLocalIntervalMock: jest.SpyInstance<void, [timerId: NodeJS.Timeout | null]>

    beforeEach(() => {
      clearLocalIntervalMock = jest
        .spyOn(Timer, 'clearLocalInterval')
        .mockImplementation(() => null)
    })
    afterEach(jest.restoreAllMocks)

    it('shold stop if shouldStop return true', () => {
      renderHook(() => Timer.useTimer(1, () => true))

      jest.runOnlyPendingTimers()

      expect(clearLocalIntervalMock).toBeCalled()
    })
    it('shold not stop if shouldStop return false', () => {
      jest.spyOn(Dates, 'currentTimestamp').mockReturnValue(1)
      const myInspector = jest.fn()
      renderHook(() =>
        Timer.useTimer(1, (elapsed) => {
          myInspector(elapsed)
          return false
        })
      )

      jest.runOnlyPendingTimers()

      expect(clearLocalIntervalMock).not.toBeCalled()
      expect(myInspector).toBeCalledWith(0)
    })
  })
})
