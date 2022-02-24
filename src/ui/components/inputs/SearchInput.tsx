import { t } from '@lingui/macro'
import React, { forwardRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { styledButton } from 'ui/components/buttons/styledButton'
import { InputLabel } from 'ui/components/InputLabel'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Invalidate as DefaultInvalidate } from 'ui/svg/icons/Invalidate'
import { getSpacing, Spacer } from 'ui/theme'

import { BaseTextInput as DefaultBaseTextInput } from './BaseTextInput'
import { StyledInputContainer } from './StyledInputContainer'
import { getCustomSearchInputProps, getRNTextInputProps, SearchInputProps } from './types'

const WithRefSearchInput: React.ForwardRefRenderFunction<RNTextInput, SearchInputProps> = (
  props,
  forwardedRef
) => {
  const [isFocus, setIsFocus] = useState<boolean>(false)
  const nativeProps = getRNTextInputProps(props)
  const customProps = getCustomSearchInputProps(props)
  const { LeftIcon, label, accessibilityLabel, accessibilityDescribedBy, onPressRightIcon } =
    customProps
  const { value = '' } = nativeProps
  const searchInputID = uuidv4()

  function onFocus() {
    setIsFocus(true)
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
      <StyledInputContainer inputHeight={props.inputHeight} isFocus={isFocus}>
        <Spacer.Row numberOfSpaces={1} />
        {!!LeftIcon && (
          <React.Fragment>
            <LeftIcon />
            <Spacer.Row numberOfSpaces={1} />
          </React.Fragment>
        )}
        <BaseTextInput
          {...nativeProps}
          nativeID={searchInputID}
          ref={forwardedRef}
          onFocus={onFocus}
          onBlur={onBlur}
          autoCorrect={false}
          returnKeyType="search"
          selectionColor={undefined}
          aria-describedby={accessibilityDescribedBy}
          {...accessibilityAndTestId(accessibilityLabel, undefined)}
        />
        {value.length > 0 && (
          <RightIconContainer
            onPress={onPressRightIcon}
            {...accessibilityAndTestId(t`Réinitialiser la recherche`)}
            type="reset">
            <Invalidate />
          </RightIconContainer>
        )}
      </StyledInputContainer>
    </React.Fragment>
  )
}

export const SearchInput = forwardRef<RNTextInput, SearchInputProps>(WithRefSearchInput)

const RightIconContainer = styledButton(Touchable)({
  position: 'absolute',
  right: getSpacing(1),
  padding: getSpacing(2),
})

const Invalidate = styled(DefaultInvalidate).attrs(({ theme }) => ({
  color: theme.colors.greyDark,
}))``

const BaseTextInput = styled(DefaultBaseTextInput).attrs(({ theme }) => ({
  selectionColor: theme.colors.greyDark,
}))``
