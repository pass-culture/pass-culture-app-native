import { useLogScrollHandler } from 'features/offerv2/helpers/useLogScrolHandler/useLogScrollHandler'
import { renderHook } from 'tests/utils'

const mockLogFunction = jest.fn()

describe('useLogScrollHandler', () => {
  it('should call the log function when element is visible', () => {
    const { result } = renderHook(() => useLogScrollHandler(mockLogFunction))

    result.current(true)

    expect(mockLogFunction).toHaveBeenCalledTimes(1)
  })

  it('should not call the log function when element is not visible', () => {
    const { result } = renderHook(() => useLogScrollHandler(mockLogFunction))

    result.current(false)

    expect(mockLogFunction).not.toHaveBeenCalled()
  })
})
