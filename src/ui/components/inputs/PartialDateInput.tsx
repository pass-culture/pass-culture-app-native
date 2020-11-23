import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components/native'

import { ColorsEnum, Spacer } from 'ui/theme'

export enum DatePartType {
  DAY = 'day',
  MONTH = 'month',
  YEAR = 'year',
}

interface PartialDateInputProps {
  identifier: DatePartType
  isValid?: boolean
  maxLength: number
  onChangeValue: (value: string, identifier: DatePartType) => void
  placeholder: string
}

export const PartialDateInput: FunctionComponent<PartialDateInputProps> = (props) => {
  const [value, setValue] = useState<string>('')
  const [isFocused, setFocused] = useState(false)

  function onChange(text: string) {
    setValue(text)
    props.onChangeValue(text, props.identifier)
  }
  function onFocus() {
    setFocused(true)
  }
  function onBlur() {
    setFocused(false)
  }

  return (
    <Container>
      <StyledInput
        keyboardType="number-pad"
        maxLength={props.maxLength}
        onChangeText={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={props.placeholder}
        value={value}
        selectTextOnFocus
        lengthByChar={props.maxLength}
      />
      <Spacer.Column numberOfSpaces={1} />
      <ValidationBar
        testID="datepart-bar"
        isValid={props.isValid}
        isEmpty={value.length === 0}
        isFocused={isFocused}
      />
    </Container>
  )
}

const Container = styled.View({
  alignItems: 'center',
})

const StyledInput = styled.TextInput<{ lengthByChar: number }>(({ lengthByChar }) => ({
  textAlign: 'center',
  fontSize: 18,
  lineHeight: '22px',
  paddingHorizontal: 10,
  minWidth: lengthByChar * 18,
}))

interface ValidationBarProps {
  backgroundColor?: ColorsEnum
  isEmpty: boolean
  isValid?: boolean
  isFocused: boolean
}

const ValidationBar = styled.View.attrs<ValidationBarProps>(({ isEmpty, isFocused, isValid }) => {
  if (isFocused) {
    return { backgroundColor: ColorsEnum.PRIMARY }
  }

  if (isEmpty) {
    return { backgroundColor: ColorsEnum.GREY_MEDIUM }
  }

  let backgroundColor
  if (isValid) {
    backgroundColor = ColorsEnum.GREEN_VALID
  } else if (isValid === false) {
    backgroundColor = ColorsEnum.ERROR
  }

  return {
    backgroundColor,
  }
})<ValidationBarProps>(({ backgroundColor }) => ({
  backgroundColor,
  height: 5,
  width: '100%',
  borderRadius: 22,
}))
