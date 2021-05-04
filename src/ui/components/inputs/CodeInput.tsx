import React, { RefObject, useRef, useState } from 'react'
import { TextInput, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native'
import styled from 'styled-components/native'

import { getSpacing } from 'ui/theme'

import { executeInputMethod, NativePressEvent, InputRefMap, BackspaceKey } from './CodeInput.utils'
import { ShortInput } from './ShortInput'

const SHORT_INPUT_MIN_WIDTH = getSpacing(8)

export interface CodeValidation {
  isComplete: boolean
  isValid: boolean
}

/**
 * WARNING: Today there are no requirements to set the value of this component from outside.
 * That's why it is not set to be controlled and you won't be able to set its value.
 * You can just get its inner value using the props onChangeValue.
 * If the requirement comes one day, do the following:
 * - add a new props: 'value: string'
 * - initialise the state like this:
 *   useState<Record<string, string>>(createMapOfInputValues({}, props.codeLength))
 */
export type CodeInputProps = {
  codeLength: number
  autoFocus?: boolean
  placeholder: string
} & (
  | {
      enableValidation: true
      onChangeValue?: (
        value: string | null,
        codeValidation: CodeValidation,
        inputPosition: number | string,
        inputValue: string
      ) => void
      /**
       * Used to compute the validation state.
       * WARNING: to perform state update based on the validation state, use onChangeValue
       */
      isValid: (value: string | null, isComplete: boolean) => boolean
      isInputValid: (value: string, position: number) => boolean
    }
  | {
      enableValidation?: false
      onChangeValue?: (value: string | null) => void
    }
)

export const CodeInput = (props: CodeInputProps) => {
  const inputsRef = useRef(
    createMap<RefObject<TextInput>>({}, props.codeLength, () => React.createRef())
  )
  const [inputValues, setInputValues] = useState<Record<string, string>>(
    createMap({}, props.codeLength, () => '')
  )

  const onChangeValue = (value: string, inputId: number) => {
    const newInputValuesAction = inputUpdator(value, inputId, props)
    setInputValues((old) => {
      handleForwardTransitions(value, inputId, inputsRef, props)

      return newInputValuesAction(old)
    })
  }

  return (
    <Container testID="code-input-container">
      {Object.keys(inputsRef.current || {}).map((key) => {
        const index = Number(key)
        const inputValue = inputValues[index] || ''
        return (
          <ShortInput
            key={index} // using index is safe since inputs are ordered and refreshed atomically
            autoFocus={index === 0 ? props.autoFocus : false}
            identifier={index}
            isValid={props.enableValidation ? props.isInputValid(inputValue, index) : true}
            onChangeValue={onChangeValue}
            placeholder={props.placeholder}
            ref={inputsRef.current[index]}
            minWidth={SHORT_INPUT_MIN_WIDTH}
            onKeyPress={(e: NativeSyntheticEvent<TextInputKeyPressEventData>) =>
              handleBackspaceTransitions(e, index, inputsRef, inputValues)
            }
            testID={`input-${index}`}
          />
        )
      })}
    </Container>
  )
}

const Container = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
})

export function createMap<T>(
  map: Record<string, T>,
  length: number,
  initializer: (index: number) => T
) {
  for (let i = 0; i < length; i++) {
    map[i] = initializer(i)
  }
  return map
}

/**
 * Generates a state action to update the current map of values with the digit
 * typed into the current input
 * @param newDigitValue the value typed into the current input
 * @param inputPosition the input identifier
 * @param props the CodeInput props
 * @returns a react state action
 */
export const inputUpdator = (
  newDigitValue: string,
  inputPosition: number,
  props: CodeInputProps
) => (currentDigitValues: Record<string, string>) => {
  let code = ''

  for (let index = 0; index < props.codeLength; index++) {
    const currentDigitValue = currentDigitValues[index] || ''
    /**
     * use the rigth value:
     * - for the current index: the value that will be stored into the state
     * - for the others indexes: the value already stored in the state
     */
    const consideredValue = index === inputPosition ? newDigitValue : currentDigitValue

    code += consideredValue
  }

  const isComplete = code.length === props.codeLength

  if (props.enableValidation) {
    props.onChangeValue?.(
      code,
      {
        isComplete,
        isValid: props.isValid(code, isComplete),
      },
      inputPosition,
      newDigitValue
    )
  } else {
    props.onChangeValue?.(code)
  }

  return { ...currentDigitValues, [inputPosition]: newDigitValue }
}

/** focus previous input after deleting all the content: only for month and year */
function handleBackspaceTransitions<
  KeyEvent extends NativePressEvent,
  InputsRef extends InputRefMap
>(e: KeyEvent, position: number, inputsRef: InputsRef, inputValues: Record<string, string>) {
  const backspacePressed = e.nativeEvent.key === BackspaceKey
  const inputLength = inputValues[position].length

  if (backspacePressed && position > 0 && inputLength <= 1) {
    executeInputMethod(inputsRef.current[position - 1].current, 'focus')
  }
}

/** focus previous input after deleting all the content: only for month and year */
function handleForwardTransitions<InputsRef extends InputRefMap>(
  value: string,
  position: number,
  inputsRef: InputsRef,
  props: CodeInputProps
) {
  const newLength = value.length
  const isForward = newLength > props.placeholder.length - 1

  if (isForward) {
    if (position < props.codeLength - 1) {
      executeInputMethod(inputsRef.current[position + 1].current, 'focus')
    }
    if (position == props.codeLength - 1) {
      executeInputMethod(inputsRef.current[position].current, 'blur')
    }
  }
}
