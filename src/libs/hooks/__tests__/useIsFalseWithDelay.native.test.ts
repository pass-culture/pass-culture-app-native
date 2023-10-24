import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { renderHook, act } from 'tests/utils'

let condition = false
const DELAY = 1000

jest.useFakeTimers({ legacyFakeTimers: true })

describe('useIsFalseWithDelay()', () => {
  it("should always return true if condition is true and doesn't change", () => {
    condition = true
    const { result } = renderUseIsFalseWithDelay(condition)

    expect(result.current).toBeTruthy()

    act(() => {
      jest.advanceTimersByTime(DELAY)
    })

    expect(result.current).toBeTruthy()
  })

  it("should always return false if condition is false and doesn't change", () => {
    const condition = false
    const { result } = renderUseIsFalseWithDelay(condition)

    expect(result.current).toBeFalsy()

    act(() => {
      jest.advanceTimersByTime(DELAY)
    })

    expect(result.current).toBeFalsy()
  })

  it('should always return false after delay if condition is true at first then false', () => {
    const condition = true
    const { result, rerender } = renderUseIsFalseWithDelay(condition)

    rerender({ condition: false })

    expect(result.current).toBeTruthy()

    act(() => {
      jest.advanceTimersByTime(DELAY)
    })

    expect(result.current).toBeFalsy()
  })
})

const renderUseIsFalseWithDelay = (condition: boolean) =>
  renderHook((props?: { condition: boolean }) =>
    useIsFalseWithDelay(props?.condition ?? condition, DELAY)
  )
