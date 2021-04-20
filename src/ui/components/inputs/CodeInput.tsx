import React, { RefObject, useEffect, useState } from 'react'
import { TextInput } from 'react-native'
import styled from 'styled-components/native'

import { ShortInput } from './ShortInput'

export interface CodeValidation {
  isComplete: boolean
  isValid: boolean
}

export type CodeInputProps = {
  codeLength: number
  autoFocus?: boolean
} & (
  | {
      enableValidation: true
      onChangeValue?: (value: string | null, codeValidation: CodeValidation) => void
      isValid: (value: string | null, isComplete: boolean) => boolean
    }
  | {
      enableValidation?: false
      onChangeValue?: (value: string | null) => void
    }
)

export const CodeInput = (props: CodeInputProps) => {
  const [inputsRef, setInputsRef] = useState<Record<string, React.RefObject<TextInput>>>({})
  const [_, setInputValues] = useState<Record<string, string>>({})

  useEffect(() => {
    setInputsRef(createMapOfRef<TextInput>({}, props.codeLength))
    return () => setInputsRef({})
  }, [props.codeLength])

  const onChangeValue = (value: string, identifier: number) => {
    setInputValues(inputUpdator(value, identifier, props))
  }

  return (
    <Container testID="code-input-container">
      {Object.keys(inputsRef || {}).map((key) => {
        const index = Number(key)
        return (
          <ShortInput
            key={index} // using index is safe since inputs are ordered and refreshed atomically
            autoFocus={index === 0 ? props.autoFocus : false}
            identifier={index}
            isValid={true}
            onChangeValue={onChangeValue}
            placeholder="0"
            ref={inputsRef[index]}
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
 * @param identifier the input identifier
 * @param props the CodeInput props
 */
export const inputUpdator = (newDigitValue: string, identifier: number, props: CodeInputProps) => (
  currentDigitValues: Record<string, string>
) => {
  let completion = 0
  let code = ''

  for (let index = 0; index < props.codeLength; index++) {
    const currentDigitValue = currentDigitValues[index] || ''
    /**
     * use the rigth value:
     * - for the current index: the value that will be stored into the state
     * - for the others indexes: the value already stored in the state
     */
    const consideredValue = index === identifier ? newDigitValue : currentDigitValue

    completion += Number(consideredValue.length > 0)
    code += consideredValue
  }

  const isComplete = completion === props.codeLength

  if (props.enableValidation) {
    props.onChangeValue?.(code, {
      isComplete,
      isValid: props.isValid(code, isComplete),
    })
  } else {
    props.onChangeValue?.(code)
  }

  return { ...currentDigitValues, [identifier]: newDigitValue }
}
