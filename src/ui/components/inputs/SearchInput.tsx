import { t } from '@lingui/macro'
import React, { forwardRef, useRef, useState } from 'react'
import { Platform, TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Invalidate as DefaultInvalidate } from 'ui/svg/icons/Invalidate'
import { getSpacing, Spacer } from 'ui/theme'

import { BaseTextInput as DefaultBaseTextInput } from './BaseTextInput'
import { InputContainer } from './InputContainer'
import { getCustomSearchInputProps, getRNTextInputProps, SearchInputProps } from './types'

const WithRefSearchInput: React.ForwardRefRenderFunction<RNTextInput, SearchInputProps> = (
  props,
  forwardedRef
) => {
  const [isFocus, setIsFocus] = useState<boolean>(false)
  const nativeProps = getRNTextInputProps(props)
  const customProps = getCustomSearchInputProps(props)
  const {
    LeftIcon,
    label,
    accessibilityDescribedBy,
    onPressRightIcon,
    inputContainerStyle,
    isFocusable = true,
    onFocus: onFocusProp,
    children,
  } = customProps
  const { value = '' } = nativeProps
  const searchInputID = props.searchInputID ?? uuidv4()
  const searchInput = useRef<RNTextInput>(null)
  const defaultKeyboardType = Platform.OS === 'web' ? 'web-search' : undefined

  function onFocus() {
    setIsFocus(true)
    if (onFocusProp) {
      onFocusProp()
    }
  }

  function onBlur() {
    setIsFocus(false)
  }

  return (
    <React.Fragment>
      {!!label && (
        <React.Fragment>
          <InputLabel htmlFor={searchInputID}>{label}</InputLabel>
          <Spacer.Column numberOfSpaces={2} />
        </React.Fragment>
      )}
      <StyledInputContainer
        inputHeight={props.inputHeight}
        isFocus={isFocus}
        style={inputContainerStyle}>
        <Spacer.Row numberOfSpaces={1} />
        {LeftIcon ? (
          <React.Fragment>
            <LeftIconContainer>
              <LeftIcon />
            </LeftIconContainer>
            <Spacer.Row numberOfSpaces={1} />
          </React.Fragment>
        ) : null}
        <BaseTextInput
          {...nativeProps}
          nativeID={searchInputID}
          ref={forwardedRef || searchInput}
          onFocus={onFocus}
          onBlur={onBlur}
          autoCorrect={false}
          returnKeyType={props.returnKeyType ?? 'search'}
          keyboardType={props.keyboardType ?? defaultKeyboardType}
          selectionColor={undefined}
          accessible={isFocusable}
          aria-describedby={accessibilityDescribedBy}
          enablesReturnKeyAutomatically={true}
          testID={'searchInput'}
        />
        {children}
        {value.length > 0 && (
          <Touchable
            onPress={onPressRightIcon}
            {...accessibilityAndTestId(t`Réinitialiser la recherche`, 'resetSearchInput')}
            type="reset">
            <Invalidate />
          </Touchable>
        )}
      </StyledInputContainer>
    </React.Fragment>
  )
}

export const SearchInput = forwardRef<RNTextInput, SearchInputProps>(WithRefSearchInput)

const LeftIconContainer = styled.View({ flexShrink: 0 })

const Invalidate = styled(DefaultInvalidate).attrs(({ theme }) => ({
  color: theme.colors.greyDark,
}))``

const BaseTextInput = styled(DefaultBaseTextInput).attrs(({ theme }) => ({
  selectionColor: theme.colors.greyDark,
}))``

const StyledInputContainer = styled(InputContainer)({
  outlineOffset: 0,
  borderRadius: getSpacing(6),
})
