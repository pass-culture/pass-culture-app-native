import { t } from '@lingui/macro'
import React, { forwardRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'

import { accessibilityAndTestId } from 'tests/utils'
import { Invalidate } from 'ui/svg/icons/Invalidate_deprecated'
import { ColorsEnum, Spacer } from 'ui/theme'

import { BaseTextInput } from './BaseTextInput'
import { StyledInputContainer } from './StyledInputContainer'
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
    <StyledInputContainer inputHeight={props.inputHeight} isFocus={isFocus}>
      {!!LeftIcon && <LeftIcon />}
      <Spacer.Row numberOfSpaces={3} />
      <BaseTextInput
        {...nativeProps}
        ref={forwardedRef}
        onFocus={onFocus}
        onBlur={onBlur}
        autoCorrect={false}
        returnKeyType="search"
        selectionColor={ColorsEnum.GREY_DARK}
        {...accessibilityAndTestId(t`Barre de recherche des offres`)}
      />
      <RightIcon />
    </StyledInputContainer>
  )
}

export const SearchInput = forwardRef<RNTextInput, SearchInputProps>(WithRefSearchInput)
