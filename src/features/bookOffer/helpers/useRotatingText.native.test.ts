import { useRotatingText } from 'features/bookOffer/helpers/useRotatingText'
import { act, renderHook } from 'tests/utils'

jest.spyOn(global, 'setInterval')

describe('useRotatingText', () => {
  beforeEach(() => jest.useFakeTimers('legacy'))
  afterEach(() => {
    jest.useRealTimers()
    // We don't really know why this is necessary but we noticed that those tests weren't independant
    // Reseting modules was the only way to make all tests passed in Jest 27
    jest.resetModules()
  })
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

  it('should not start until wanted', () => {
    const hook = renderHook((isLoading = false) =>
      useRotatingText(
        [{ message: 'Hello', keepDuration: 3000 }, { message: 'Jest' }],
        isLoading as boolean /* why do i have to specify type ?? */
      )
    )

    expect(hook.result.current).toEqual('Hello')

    act(() => {
      jest.runOnlyPendingTimers()
    })
    expect(hook.result.current).toEqual('Hello')

    act(() => {
      hook.rerender(true)
    })
    expect(hook.result.current).toEqual('Hello')
    act(() => {
      jest.runOnlyPendingTimers()
    })
    expect(hook.result.current).toEqual('Jest')
  })
})
