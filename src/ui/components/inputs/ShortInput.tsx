import React, { forwardRef, Ref, useState } from 'react'
import { TextInput } from 'react-native'
import styled from 'styled-components/native'

import { ColorsEnum, getSpacing, Spacer } from 'ui/theme'

import { BaseTextInput } from './BaseTextInput'

// unknown will be infered
type ShortInputProps<Identifier extends unknown> = React.ComponentPropsWithRef<typeof TextInput> & {
  identifier: Identifier
  isValid?: boolean
  onChangeValue: (value: string, identifier: Identifier) => void
  placeholder: string
}

// unknown will be infered
export const ShortInputComponent = <Identifier extends unknown>(
  props: ShortInputProps<Identifier>,
  forwardedRef: Ref<TextInput>
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
        autoFocus={props.autoFocus}
        blurOnSubmit
        keyboardType="number-pad"
        maxLength={props.placeholder.length}
        numberOfChar={props.placeholder.length}
        onBlur={onBlur}
        onChangeText={onChange}
        onFocus={onFocus}
        onKeyPress={props.onKeyPress}
        placeholder={props.placeholder}
        ref={forwardedRef}
        selectTextOnFocus
        value={value}
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

export const ShortInput = forwardRef(ShortInputComponent) as <Identifier extends unknown>(
  p: ShortInputProps<Identifier> & { ref?: Ref<TextInput> }
) => JSX.Element

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
    minWidth: lengthByChar * 20,
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
