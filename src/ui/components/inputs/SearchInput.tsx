import { t } from '@lingui/macro'
import React, { forwardRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { useAppSettings } from 'features/auth/settings'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { styledButton } from 'ui/components/buttons/styledButton'
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
    accessibilityLabel,
    accessibilityDescribedBy,
    onPressRightIcon,
    focusOutlineColor,
  } = customProps
  const { value = '' } = nativeProps
  const searchInputID = props.searchInputID ?? uuidv4()
  const { data: appSettings } = useAppSettings()
  const appEnableSearchHomepageRework = appSettings?.appEnableSearchHomepageRework ?? false

  function onFocus() {
    setIsFocus(true)
    if (props?.onFocusSearchInput) props.onFocusSearchInput()
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
        focusOutlineColor={focusOutlineColor}>
        <Spacer.Row numberOfSpaces={1} />
        {!!LeftIcon && !appEnableSearchHomepageRework ? (
          <React.Fragment>
            <LeftIcon />
            <Spacer.Row numberOfSpaces={1} />
          </React.Fragment>
        ) : null}
        <BaseTextInput
          {...nativeProps}
          nativeID={searchInputID}
          ref={forwardedRef}
          onFocus={onFocus}
          onBlur={onBlur}
          autoCorrect={false}
          returnKeyType={props.returnKeyType ?? 'search'}
          selectionColor={undefined}
          aria-describedby={accessibilityDescribedBy}
          {...accessibilityAndTestId(accessibilityLabel, label ? undefined : 'searchInput')}
        />
        {value.length > 0 && (
          <RightIconContainer
            onPress={onPressRightIcon}
            {...accessibilityAndTestId(t`Réinitialiser la recherche`)}
            type="reset"
            testID="resetSearchInput">
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

const StyledInputContainer = styled(InputContainer)({
  outlineOffset: 0,
})
