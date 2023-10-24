import useFunctionOnce from 'libs/hooks/useFunctionOnce'
import { renderHook } from 'tests/utils'

const callBackFn = jest.fn()

describe('useFunctionOnce()', () => {
  it('should only call callback function once', () => {
    const { result } = renderHook(() => useFunctionOnce(callBackFn))
    result.current()

    expect(callBackFn).toHaveBeenCalledTimes(1)

    result.current()

    expect(callBackFn).toHaveBeenCalledTimes(1)
  })
})
