import { act, renderHook } from 'tests/utils'

import { useOneTimePassword } from './useOneTimePassword'

describe('useOneTimePassword', () => {
  it('should initialize an empty code with the given number of inputs', () => {
    const { result } = renderHook(() => useOneTimePassword({ numberOfInputs: 6 }))

    expect(result.current.code).toEqual(['', '', '', '', '', ''])
    expect(result.current.isCodeComplete).toBe(false)
  })

  it('should initialize an empty code with a custom number of inputs', () => {
    const { result } = renderHook(() => useOneTimePassword({ numberOfInputs: 4 }))

    expect(result.current.code).toEqual(['', '', '', ''])
    expect(result.current.isCodeComplete).toBe(false)
  })

  it('should update the code', () => {
    const { result } = renderHook(() => useOneTimePassword({ numberOfInputs: 6 }))

    act(() => result.current.handleCodeChange(['1', '2', '3', '', '', '']))

    expect(result.current.code).toEqual(['1', '2', '3', '', '', ''])
    expect(result.current.isCodeComplete).toBe(false)
  })

  it('should consider the code complete when all inputs contain a digit', () => {
    const { result } = renderHook(() => useOneTimePassword({ numberOfInputs: 6 }))

    act(() => result.current.handleCodeChange(['1', '2', '3', '4', '5', '6']))

    expect(result.current.isCodeComplete).toBe(true)
  })

  it('should consider the code incomplete when an input is empty', () => {
    const { result } = renderHook(() => useOneTimePassword({ numberOfInputs: 6 }))

    act(() => result.current.handleCodeChange(['1', '2', '3', '', '5', '6']))

    expect(result.current.isCodeComplete).toBe(false)
  })

  it('should consider the code incomplete when an input is not numeric', () => {
    const { result } = renderHook(() => useOneTimePassword({ numberOfInputs: 6 }))

    act(() => result.current.handleCodeChange(['1', '2', 'A', '4', '5', '6']))

    expect(result.current.isCodeComplete).toBe(false)
  })

  it('should consider the code incomplete when its length differs from the number of inputs', () => {
    const { result } = renderHook(() => useOneTimePassword({ numberOfInputs: 6 }))

    act(() => result.current.handleCodeChange(['1', '2', '3', '4', '5']))

    expect(result.current.isCodeComplete).toBe(false)

    act(() => result.current.handleCodeChange(['1', '2', '3', '4', '5', '6', '7']))

    expect(result.current.isCodeComplete).toBe(false)
  })
})
