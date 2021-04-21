import React, { RefObject, useRef, useState } from 'react'
import { TextInput } from 'react-native'
import styled from 'styled-components/native'

import { ShortInput } from './ShortInput'

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
 * - creates a function that converts a string to a map (index=>letter) and use it to initialise 'inputValues'
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
  const inputsRef = useRef(createMapOfRef<TextInput>({}, props.codeLength))
  const [inputValues, setInputValues] = useState<Record<string, string>>({})

  const onChangeValue = (value: string, inputId: number) => {
    setInputValues(inputUpdator(value, inputId, props))
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

function createMapOfRef<U, T extends RefObject<U> = RefObject<U>>(
  map: Record<string, T>,
  length: number
) {
  for (let i = 0; i < length; i++) {
    map[i] = map[i] ?? React.createRef()
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
  let completion = 0
  let code = ''

  for (let index = 0; index < props.codeLength; index++) {
    const currentDigitValue = currentDigitValues[index] || ''
    /**
     * use the rigth value:
     * - for the current index: the value that will be stored into the state
     * - for the others indexes: the value already stored in the state
     */
    const consideredValue = index === inputPosition ? newDigitValue : currentDigitValue

    completion += Number(consideredValue.length > 0)
    code += consideredValue
  }

  const isComplete = completion === props.codeLength

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
