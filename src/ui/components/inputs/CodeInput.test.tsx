import React from 'react'

import { render } from 'tests/utils'

import { CodeInput, CodeInputProps, inputUpdator } from './CodeInput'

describe('CodeInput', () => {
  it.each([1, 2, 3])('should contain the right number of inputs', (length) => {
    const { getByTestId } = render(<CodeInput codeLength={length} placeholder="O" />)

    const container = getByTestId('code-input-container')

    expect(container.props.children.length).toEqual(length)
  })
  it.each([
    [0, true],
    [1, false],
    [2, false],
  ])('should pass the autofocus only to the first input', (inputIndex, expectedAutoFocus) => {
    const { getByTestId } = render(<CodeInput codeLength={3} placeholder="O" autoFocus />)

    const container = getByTestId('code-input-container')
    const input = container.props.children[inputIndex]

    expect(input.props.autoFocus).toBe(expectedAutoFocus)
  })
  describe('inputUpdator', () => {
    it.each([true, false])(
      'should call onChangeValue with the right parameters when enableValidation = %s',
      (enableValidation) => {
        const onChangeValue = jest.fn()
        const props: CodeInputProps = {
          codeLength: 3,
          placeholder: '0',
          autoFocus: true,
          enableValidation,
          onChangeValue,
          isValid: (code: string | null, isComplete: boolean) => Boolean(code && isComplete),
          isInputValid: () => true,
        }

        const inputPosition = 2
        const setStateAction = inputUpdator('5', inputPosition, props)
        setStateAction({
          0: '1',
          1: '2',
          2: '4', // changing the third column
        })

        if (enableValidation) {
          expect(onChangeValue).toBeCalledWith(
            '125',
            {
              isValid: true,
              isComplete: true,
            },
            inputPosition,
            '5'
          )
        } else {
          expect(onChangeValue).toBeCalledWith('125')
        }
      }
    )

    it.each([true, false])('should return the same validity than the isValid props', (isValid) => {
      const onChangeValue = jest.fn()
      const props: CodeInputProps = {
        codeLength: 3,
        placeholder: '0',
        autoFocus: true,
        enableValidation: true,
        onChangeValue,
        isValid: () => isValid,
        isInputValid: () => true,
      }

      const inputPosition = 1
      const setStateAction = inputUpdator('7', inputPosition, props)
      setStateAction({
        0: '1',
        1: '2', // changing the third column
        2: '7',
      })

      expect(onChangeValue).toBeCalledWith(
        '177',
        {
          isValid,
          isComplete: true,
        },
        inputPosition,
        '7'
      )
    })

    it.each([
      [{}, 0, '', '', false], // set input-0 with nothing
      [{}, 2, '5', '5', false], // set input-2 with '5'
      [{ 0: '5' }, 1, '8', '58', false], // set input-1 with '8'
      [{ 0: '5', 1: '8' }, 2, '7', '587', true], // set input-2 with '7'
      [{ 0: '5', 1: '8' }, 2, '', '58', false], // reset input-2 with ''
    ])(
      'should return the right state of completion',
      (currentState, inputPosition, typed, expectedCode, expectedIsComplete) => {
        const onChangeValue = jest.fn()
        const props: CodeInputProps = {
          codeLength: 3,
          placeholder: '0',
          autoFocus: true,
          enableValidation: true,
          onChangeValue,
          isValid: () => true,
          isInputValid: () => true,
        }

        const setStateAction = inputUpdator(typed, inputPosition, props)
        setStateAction(currentState)

        expect(onChangeValue).toBeCalledWith(
          expectedCode,
          {
            isValid: true,
            isComplete: expectedIsComplete,
          },
          inputPosition,
          typed
        )
      }
    )
  })

  it('should return the expected state', () => {
    const onChangeValue = jest.fn()
    const props: CodeInputProps = {
      codeLength: 3,
      placeholder: '0',
      autoFocus: true,
      enableValidation: true,
      onChangeValue,
      isValid: () => true,
      isInputValid: () => true,
    }

    const inputPosition = 1
    const setStateAction = inputUpdator('7', inputPosition, props)
    const newState = setStateAction({
      0: '1',
      1: '2', // changing the third column
      2: '7',
    })

    expect(newState).toEqual({
      0: '1',
      1: '7', // changed
      2: '7',
    })
  })
})
