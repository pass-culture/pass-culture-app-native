import React, { RefObject, useEffect, useState } from 'react'
import { TextInput } from 'react-native'
import styled from 'styled-components/native'

import { ShortInput } from './ShortInput'

interface CodeInputProps {
  codeLength: number
  autoFocus?: boolean
  onChangeValue?: (value: number | null) => void
  minValue?: number
  maxValue?: number
}

export const CodeInput = (props: CodeInputProps) => {
  const [digitInputsRef, setDigitInputsRef] = useState<Record<string, React.RefObject<TextInput>>>(
    {}
  )
  const [_, setDigitValues] = useState<Record<string, string>>({})

  useEffect(() => {
    setDigitInputsRef(createMapOfRef<TextInput>({}, props.codeLength))
    return () => setDigitInputsRef({})
  }, [props.codeLength])

  const setField = (value: string, identifier: number) => {
    setDigitValues((old) => ({ ...old, [identifier]: value }))
  }

  return (
    <Container testID="code-input-container">
      {Object.keys(digitInputsRef || {}).map((key) => {
        const index = Number(key)
        return (
          <ShortInput
            key={index} // using index is safe since inputs are ordered and refreshed atomically
            autoFocus={index === 0 ? props.autoFocus : false}
            identifier={index}
            isValid={true}
            onChangeValue={setField}
            placeholder="0"
            ref={digitInputsRef[index]}
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
  Array(length)
    .fill(0)
    .forEach((_, i) => void (map[i] = map[i] ?? React.createRef()))
  return map
}
