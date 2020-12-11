import React, { forwardRef, useState } from 'react'
import { TextInput } from 'react-native'
import styled from 'styled-components/native'

import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

import { BaseTextInput } from './BaseTextInput'

export enum DatePartType {
  DAY = 'day',
  MONTH = 'month',
  YEAR = 'year',
}

interface PartialDateInputProps extends React.ComponentPropsWithRef<typeof TextInput> {
  identifier: DatePartType
  isValid?: boolean
  onChangeValue: (value: string, identifier: DatePartType) => void
  placeholder: string
}

export const _PartialDateInput: React.ForwardRefRenderFunction<TextInput, PartialDateInputProps> = (
  props,
  forwardedRef
) => {
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
        maxLength={props.placeholder.length}
        onChangeText={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={props.placeholder}
        value={value}
        selectTextOnFocus
        numberOfChar={props.placeholder.length}
        ref={forwardedRef}
        onKeyPress={props.onKeyPress}
        blurOnSubmit
      />
      <Spacer.Column numberOfSpaces={1} />
      <ValidationBar
        testID={`datepart-bar-${props.identifier}`}
        isValid={props.isValid}
        isEmpty={value.length === 0}
        isFocused={isFocused}
      />
    </Container>
  )
}

export const PartialDateInput = forwardRef<TextInput, PartialDateInputProps>(_PartialDateInput)

const Container = styled.View({
  alignItems: 'center',
  margin: getSpacing(1),
})

// using styled.TextInput triggers a typescript error on the 'ref' property
const StyledInput = styled(BaseTextInput)<{ numberOfChar: number }>(
  ({ numberOfChar: lengthByChar }) => ({
    textAlign: 'center',
    fontSize: 18,
    lineHeight: '22px',
    paddingHorizontal: 10,
    minWidth: lengthByChar * 18,
  })
)

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
  if (isValid) {
    return { backgroundColor: ColorsEnum.GREEN_VALID }
  }

  return { backgroundColor: ColorsEnum.ERROR }
})<ValidationBarProps>(({ backgroundColor }) => ({
  backgroundColor,
  height: 5,
  width: '100%',
  borderRadius: 22,
}))
