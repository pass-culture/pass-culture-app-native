import React, { forwardRef } from 'react'
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
  const nativeProps = getRNTextInputProps(props)
  const customProps = getCustomSearchInputProps(props)
  const { LeftIcon, RightIcon = () => <Invalidate size={24} /> } = customProps

  return (
    <InputContainer inputHeight={props.inputHeight}>
      <LeftIcon />
      <Spacer.Row numberOfSpaces={2} />
      <BaseTextInput
        {...nativeProps}
        ref={forwardedRef}
        autoCorrect={false}
        returnKeyType="search"
        selectionColor={ColorsEnum.GREY_DARK}
      />
      <RightIcon />
    </InputContainer>
  )
}

export const SearchInput = forwardRef<RNTextInput, SearchInputProps>(WithRefSearchInput)
