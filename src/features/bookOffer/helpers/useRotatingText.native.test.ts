import { useRotatingText } from 'features/bookOffer/helpers/useRotatingText'
import { act, renderHook } from 'tests/utils'

jest.useFakeTimers()

describe('useRotatingText', () => {
  it('should return a new text every 3 seconds', () => {
    const hook = renderHook(() =>
      useRotatingText([{ message: 'Hello', keepDuration: 3000 }, { message: 'Jest' }])
    )

    expect(hook.result.current).toEqual('Hello')

    // Skipping only 2s of 3s
    jest.advanceTimersByTime(2000)

    expect(hook.result.current).toEqual('Hello')

    // Skipping rest
    act(() => {
      jest.runOnlyPendingTimers()
    })

    expect(hook.result.current).toEqual('Jest')
  })

  it('should loop when last message has a duration', () => {
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
