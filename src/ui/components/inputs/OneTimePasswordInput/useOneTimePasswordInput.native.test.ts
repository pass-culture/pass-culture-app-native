import { act, renderHook } from 'tests/utils'

import { useOneTimePasswordInput } from './useOneTimePasswordInput'

const EMPTY_CODE = ['', '', '', '']
const INITIAL_CODE = ['1', '2', '', '']
const CODE_WITH_VALUE = ['1', '', '', '']
const CODE_WITH_INVALID_VALUE = ['1', 'A', '', '4']

const createMockInput = () => ({ focus: jest.fn() })

describe('useOneTimePasswordInput', () => {
  it('should initialize values from code', () => {
    const onCodeChange = jest.fn()

    const { result } = renderHook(() =>
      useOneTimePasswordInput({
        code: INITIAL_CODE,
        numberOfInputs: 4,
        onCodeChange,
      })
    )

    expect(result.current.values).toEqual(INITIAL_CODE)
  })

  it('should synchronize values when code changes', () => {
    const onCodeChange = jest.fn()

    const { result, rerender } = renderHook(
      ({ code }: { code: string[] }) =>
        useOneTimePasswordInput({
          code,
          numberOfInputs: 4,
          onCodeChange,
        }),
      {
        initialProps: { code: CODE_WITH_VALUE },
      }
    )

    expect(result.current.values).toEqual(CODE_WITH_VALUE)

    rerender({ code: ['1', '2', '3', ''] })

    expect(result.current.values).toEqual(['1', '2', '3', ''])
  })

  it('should call onCodeChange when a character is entered', () => {
    const onCodeChange = jest.fn()

    const { result } = renderHook(() =>
      useOneTimePasswordInput({
        code: EMPTY_CODE,
        numberOfInputs: 4,
        onCodeChange,
      })
    )

    act(() => result.current.handleChangeText('1', 0))

    expect(onCodeChange).toHaveBeenCalledWith(CODE_WITH_VALUE)
  })

  it('should focus the next input after entering a character', () => {
    const onCodeChange = jest.fn()
    const firstInput = createMockInput()
    const secondInput = createMockInput()

    const { result } = renderHook(() =>
      useOneTimePasswordInput({
        code: EMPTY_CODE,
        numberOfInputs: 4,
        onCodeChange,
      })
    )

    act(() => {
      result.current.setInputRef(0, firstInput as never)
      result.current.setInputRef(1, secondInput as never)
      result.current.handleChangeText('1', 0)
    })

    expect(secondInput.focus).toHaveBeenCalledTimes(1)
  })

  it('should focus the first input after entering a character in the last input', () => {
    const onCodeChange = jest.fn()
    const firstInput = createMockInput()

    const { result } = renderHook(() =>
      useOneTimePasswordInput({
        code: EMPTY_CODE,
        numberOfInputs: 4,
        onCodeChange,
      })
    )

    act(() => {
      result.current.setInputRef(0, firstInput as never)
      result.current.handleChangeText('6', 3)
    })

    expect(firstInput.focus).toHaveBeenCalledTimes(1)
  })

  it('should focus the previous input when backspace is pressed on an empty input', () => {
    const onCodeChange = jest.fn()
    const previousInput = createMockInput()

    const { result } = renderHook(() =>
      useOneTimePasswordInput({
        code: CODE_WITH_VALUE,
        numberOfInputs: 4,
        onCodeChange,
      })
    )

    act(() => {
      result.current.setInputRef(0, previousInput as never)
      result.current.handleBackspace(1)
    })

    expect(previousInput.focus).toHaveBeenCalledTimes(1)
  })

  it('should focus the last filled input after pasting', () => {
    const onCodeChange = jest.fn()
    const fourthInput = createMockInput()

    const { result } = renderHook(() =>
      useOneTimePasswordInput({
        code: EMPTY_CODE,
        numberOfInputs: 4,
        onCodeChange,
      })
    )

    act(() => {
      result.current.setInputRef(3, fourthInput as never)
      result.current.handleChangeText('1234', 0)
    })

    expect(fourthInput.focus).toHaveBeenCalledTimes(1)
  })

  it('should update the focused index', () => {
    const onCodeChange = jest.fn()

    const { result } = renderHook(() =>
      useOneTimePasswordInput({
        code: EMPTY_CODE,
        numberOfInputs: 4,
        onCodeChange,
      })
    )

    expect(result.current.focusedIndex).toBeNull()

    act(() => result.current.setFocusedIndex(2))

    expect(result.current.focusedIndex).toBe(2)
  })

  it('should expose invalid indexes', () => {
    const onCodeChange = jest.fn()

    const { result } = renderHook(() =>
      useOneTimePasswordInput({
        code: CODE_WITH_INVALID_VALUE,
        numberOfInputs: 4,
        onCodeChange,
      })
    )

    expect(result.current.invalidIndexes).toEqual([1])
  })
})
