import React, { forwardRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'

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
          <LeftIcon />
          <Spacer.Row numberOfSpaces={2} />
        </React.Fragment>
      )}
      <BaseTextInput
        {...nativeProps}
        ref={forwardedRef}
        onFocus={onFocus}
        onBlur={onBlur}
        clearButtonMode={LeftIcon ? 'never' : 'always'}
        autoCorrect={false}
        returnKeyType="search"
        selectionColor={ColorsEnum.GREY_DARK}
      />
    </InputContainer>
  )
}

export const SearchInput = forwardRef<RNTextInput, TextInputProps>(WithRefSearchInput)
