import React, { forwardRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { ArrowPrevious } from 'ui/svg/icons/ArrowPrevious'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { ColorsEnum } from 'ui/theme'

import { Spacer } from '../spacer/Spacer'

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

  const [isFocus, setIsFocus] = useState(false)

  function onFocus() {
    setIsFocus(true)
  }

  function onBlur() {
    setIsFocus(false)
  }

  return (
    <InputContainer isFocus={isFocus} inputHeight={props.inputHeight}>
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

export const SearchInput = forwardRef<RNTextInput, SearchInputProps>(WithRefSearchInput)
