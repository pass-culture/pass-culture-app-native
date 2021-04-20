import React from 'react'
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
  return (
    <Container>
      <ShortInput
        autoFocus={props.autoFocus}
        identifier={0}
        isValid={true}
        onChangeValue={(_value, _identifier) => {
          // TODO: next Ticket 8213
        }}
        placeholder="0"
      />
    </Container>
  )
}

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})
