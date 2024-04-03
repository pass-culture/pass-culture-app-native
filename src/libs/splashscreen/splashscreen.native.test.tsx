import mockdate from 'mockdate'

import { SplashScreenProvider, useSplashScreenContext } from 'libs/splashscreen/splashscreen'
import { renderHook, act } from 'tests/utils'

const MIN_SPLASHSCREEN_DURATION_IN_MS = 2000

const TODAY = new Date('2022-10-14')

jest.useFakeTimers()

describe('useSplashScreenContext()', () => {
  beforeEach(() => {
    mockdate.set(TODAY)
    jest.clearAllTimers()
  })

  it('should hide splashscreen without waiting when it has been shown for long enough', () => {
    const { result } = renderSplashScreenHook()
    mockdate.set(TODAY.getTime() + MIN_SPLASHSCREEN_DURATION_IN_MS)

    act(() => {
      result.current.hideSplashScreen?.()
    })

    expect(result.current.isSplashScreenHidden).toBe(true)
  })

  it('should not hide splashscreen when it has not been shown for long enough', () => {
    const { result } = renderSplashScreenHook()

    act(() => {
      result.current.hideSplashScreen?.()
      jest.advanceTimersByTime(MIN_SPLASHSCREEN_DURATION_IN_MS - 1)
    })

    expect(result.current.isSplashScreenHidden).toBe(false)
  })

  it('should hide splashscreen when it has been shown for long enough', () => {
    const { result } = renderSplashScreenHook()

    act(() => {
      result.current.hideSplashScreen?.()
      jest.advanceTimersByTime(MIN_SPLASHSCREEN_DURATION_IN_MS)
    })

    expect(result.current.isSplashScreenHidden).toBe(true)
  })
})

function renderSplashScreenHook() {
  return renderHook(useSplashScreenContext, {
    wrapper: SplashScreenProvider,
  })
}
