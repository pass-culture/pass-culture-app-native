import React, { forwardRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { Invalidate } from 'ui/svg/icons/Invalidate'
import { ColorsEnum, Spacer } from 'ui/theme'

import { BaseTextInput } from './BaseTextInput'
import { InputContainer } from './InputContainer'
import { getCustomSearchInputProps, getRNTextInputProps, SearchInputProps } from './types'

const WithRefSearchInput: React.ForwardRefRenderFunction<RNTextInput, SearchInputProps> = (
  props,
  forwardedRef
) => {
  const [isFocus, setIsFocus] = useState<boolean>(false)
  const nativeProps = getRNTextInputProps(props)
  const customProps = getCustomSearchInputProps(props)
  const { LeftIcon, RightIcon = () => <Invalidate size={24} /> } = customProps

  function onFocus() {
    setIsFocus(true)
  }

  function onBlur() {
    setIsFocus(false)
  }

  return (
    <InputContainer inputHeight={props.inputHeight} isFocus={isFocus}>
      {LeftIcon && <LeftIcon />}
      <Spacer.Row numberOfSpaces={2} />
      <BaseTextInput
        {...nativeProps}
        ref={forwardedRef}
        onFocus={onFocus}
        onBlur={onBlur}
        autoCorrect={false}
        returnKeyType="search"
        selectionColor={ColorsEnum.GREY_DARK}
      />
      <RightIcon />
    </InputContainer>
  )
}

export const SearchInput = forwardRef<RNTextInput, SearchInputProps>(WithRefSearchInput)
