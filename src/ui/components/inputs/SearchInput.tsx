import React, { forwardRef, useRef } from 'react'
import { Insets, Platform, TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { getComputedAccessibilityLabel } from 'shared/accessibility/getComputedAccessibilityLabel'
import { hiddenFromScreenReader } from 'shared/accessibility/hiddenFromScreenReader'
import { FlexInputLabel } from 'ui/components/InputLabel/FlexInputLabel'
import { LabelContainer } from 'ui/components/inputs/LabelContainer'
import { RequiredLabel } from 'ui/components/inputs/RequiredLabel'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Invalidate as DefaultInvalidate } from 'ui/svg/icons/Invalidate'
import { getSpacing, Typo } from 'ui/theme'

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
    onPressRightIcon,
    inputContainerStyle,
    isFocusable = true,
    onFocus: onFocusProp,
    children,
    isRequiredField,
    disableClearButton,
    accessibilityHint,
  } = customProps
  const { value = '' } = nativeProps
  const searchInputID = props.searchInputID ?? uuidv4()
  const searchInput = useRef<RNTextInput>(null)
  const defaultKeyboardType = Platform.OS === 'web' ? 'web-search' : undefined
  const showClearButton = value.length > 0 && !disableClearButton

  function onFocus() {
    onFocusDefault()
    if (onFocusProp) {
      onFocusProp()
    }
  }

  const computedAccessibilityLabel = getComputedAccessibilityLabel(
    'Champs de texte (recherche)',
    label,
    props.format ? `Exemple\u00a0: ${props.format}` : null,
    isRequiredField ? 'Obligatoire' : null,
    accessibilityHint
  )

  const hiddenFromScreenReaderMobile = Platform.OS === 'web' ? {} : hiddenFromScreenReader()

  return (
    <React.Fragment>
      {label ? (
        <StyledView {...hiddenFromScreenReaderMobile}>
          <FlexInputLabel htmlFor={searchInputID}>
            <LabelContainer>
              <Typo.Body>{label}</Typo.Body>
              {isRequiredField ? <RequiredLabel /> : null}
            </LabelContainer>
          </FlexInputLabel>
        </StyledView>
      ) : null}
      {props.format ? (
        <StyledView {...hiddenFromScreenReaderMobile}>
          <TextFormat>{`Exemple\u00a0: ${props.format}`}</TextFormat>
        </StyledView>
      ) : null}
      <StyledInputContainer
        inputHeight={props.inputHeight}
        isFocus={isFocus}
        style={inputContainerStyle}>
        {LeftIcon ? (
          <LeftIconContainer>
            <LeftIcon />
          </LeftIconContainer>
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
          accessibilityLabel={computedAccessibilityLabel}
          accessibilityHidden={!isFocusable}
          accessibilityRequired={isRequiredField}
          enablesReturnKeyAutomatically
          testID={nativeProps.testID || 'searchInput'}
          textStyle={props.textStyle}
        />
        {children}
        {showClearButton ? (
          <Touchable
            hitSlop={hitSlop}
            onPress={onPressRightIcon}
            accessibilityLabel="Réinitialiser la recherche"
            type="reset">
            <Invalidate />
          </Touchable>
        ) : null}
      </StyledInputContainer>
    </React.Fragment>
  )
}

export const SearchInput = forwardRef<RNTextInput, SearchInputProps>(WithRefSearchInput)

const LeftIconContainer = styled.View({ flexShrink: 0, marginRight: getSpacing(2) })

const Invalidate = styled(DefaultInvalidate).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
}))``

const BaseTextInput = styled(DefaultBaseTextInput).attrs(({ theme }) => ({
  selectionColor: theme.designSystem.color.text.subtle,
}))``

const StyledInputContainer = styled(InputContainer)(({ theme }) => ({
  borderRadius: theme.designSystem.size.borderRadius.m,
}))

const StyledView = styled.View({
  marginBottom: getSpacing(2),
})

const TextFormat = styled(Typo.BodyAccentXs)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
