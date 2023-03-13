import { useRotatingText } from 'features/bookOffer/helpers/useRotatingText'
import { act, renderHook } from 'tests/utils'

jest.useFakeTimers()
jest.spyOn(global, 'setInterval')

describe('useRotatingText', () => {
  it('should return a new text every 3 seconds', () => {
    const hook = renderHook(() =>
      useRotatingText([{ message: 'Hello', keepDuration: 3000 }, { message: 'Jest' }])
    )

    expect(setInterval).toHaveBeenNthCalledWith(1, expect.any(Function), 3000)
    expect(hook.result.current).toEqual('Hello')

    // Skipping only 1s of 3s
    jest.advanceTimersByTime(1000)
    expect(hook.result.current).toEqual('Hello')

    // Skipping rest
    act(() => {
      jest.runOnlyPendingTimers()
    })
    expect(hook.result.current).toEqual('Jest')
  })

  it('should loop when last message has a duration', () => {
    jest.spyOn(global, 'setInterval')

    const hook = renderHook(() =>
      useRotatingText([
        { message: 'Hello', keepDuration: 3000 },
        { message: 'Jest', keepDuration: 2000 },
      ])
    )

    expect(hook.result.current).toEqual('Hello')

    act(() => {
      jest.advanceTimersByTime(3000)
    })
    expect(hook.result.current).toEqual('Jest')

    act(() => {
      jest.advanceTimersByTime(2000)
    })
    expect(hook.result.current).toEqual('Hello')
  })

  it('should run infinitely when last message has no `keepDuration`', () => {
    const hook = renderHook(() =>
      useRotatingText([{ message: 'Hello', keepDuration: 3000 }, { message: 'Jest' }])
    )

    expect(setInterval).toHaveBeenNthCalledWith(1, expect.any(Function), 3000)
    expect(hook.result.current).toEqual('Hello')

    act(() => {
      jest.runOnlyPendingTimers()
    })
    expect(hook.result.current).toEqual('Jest')

    act(() => {
      jest.runOnlyPendingTimers()
    })
    expect(hook.result.current).toEqual('Jest')
  })

  it('should clear interval on exit', () => {
    jest.spyOn(global, 'setInterval')

    const hook = renderHook(() =>
      useRotatingText([
        { message: 'Hello', keepDuration: 3000 },
        { message: 'Jest', keepDuration: 2000 },
      ])
    )

    hook.unmount()

    expect(clearInterval).toHaveBeenCalledTimes(1)
  })
})
