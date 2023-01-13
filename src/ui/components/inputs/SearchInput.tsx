import React, { forwardRef, useRef } from 'react'
import { Insets, Platform, TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { FlexInputLabel } from 'ui/components/InputLabel/FlexInputLabel'
import { LabelContainer } from 'ui/components/inputs/LabelContainer'
import { RequiredLabel } from 'ui/components/inputs/RequiredLabel'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Invalidate as DefaultInvalidate } from 'ui/svg/icons/Invalidate'
import { getSpacing, Spacer, Typo } from 'ui/theme'

import { BaseTextInput as DefaultBaseTextInput } from './BaseTextInput'
import { InputContainer } from './InputContainer'
import { getCustomSearchInputProps, getRNTextInputProps, SearchInputProps } from './types'

const inset = 10 // arbitrary hitSlop zone inset for touchable
const hitSlop: Insets = { top: inset, right: inset, bottom: inset, left: inset }

const WithRefSearchInput: React.ForwardRefRenderFunction<RNTextInput, SearchInputProps> = (
  props,
  forwardedRef
) => {
  const { onFocus: onFocusDefault, onBlur, isFocus } = useHandleFocus()
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
    isRequiredField,
  } = customProps
  const { value = '' } = nativeProps
  const searchInputID = props.searchInputID ?? uuidv4()
  const searchInput = useRef<RNTextInput>(null)
  const defaultKeyboardType = Platform.OS === 'web' ? 'web-search' : undefined

  function onFocus() {
    onFocusDefault()
    if (onFocusProp) {
      onFocusProp()
    }
  }

  return (
    <React.Fragment>
      {!!label && (
        <React.Fragment>
          <FlexInputLabel htmlFor={searchInputID}>
            <LabelContainer>
              <Typo.Body>{label}</Typo.Body>
              {!!isRequiredField && <RequiredLabel />}
            </LabelContainer>
          </FlexInputLabel>
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
          focusable={isFocusable}
          accessibilityHidden={!isFocusable}
          accessibilityDescribedBy={accessibilityDescribedBy}
          accessibilityRequired={isRequiredField}
          enablesReturnKeyAutomatically
          testID="searchInput"
        />
        {children}
        {value.length > 0 && (
          <Touchable
            hitSlop={hitSlop}
            onPress={onPressRightIcon}
            accessibilityLabel="Réinitialiser la recherche"
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
