import React, { forwardRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { ColorsEnum } from 'ui/theme'

import { Spacer } from '../spacer/Spacer'

import { BaseTextInput } from './BaseTextInput'
import { InputContainer } from './InputContainer'
import { getCustomTextInputProps, getRNTextInputProps, TextInputProps } from './types'

const WithRefSearchInput: React.ForwardRefRenderFunction<RNTextInput, TextInputProps> = (
  props,
  forwardedRef
) => {
  const nativeProps = getRNTextInputProps(props)
  const customProps = getCustomTextInputProps(props)
  const LeftIcon = props.LeftIcon
  const RightIcon = props.RightIcon || (() => <Invalidate size={24} />)

  const [isFocus, setIsFocus] = useState(false)

  function onFocus() {
    setIsFocus(true)
  }

  function onBlur() {
    setIsFocus(false)
  }

  return (
    <InputContainer isFocus={isFocus} isError={customProps.isError} inputHeight={props.inputHeight}>
      {!!LeftIcon && (
        <React.Fragment>
          {/* TODO: show left icon depending on nb of results. This is a temporary way to show both icons */}
          {isFocus ? <LeftIcon /> : <ArrowPrevious />}
          <Spacer.Row numberOfSpaces={2} />
        </React.Fragment>
      )}
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

export const SearchInput = forwardRef<RNTextInput, TextInputProps>(WithRefSearchInput)
