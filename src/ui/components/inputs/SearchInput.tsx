import { t } from '@lingui/macro'
import React, { forwardRef, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'tests/utils'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { ColorsEnum } from 'ui/theme/colors'

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
  const { LeftIcon, label, accessibilityLabel, accessibilityDescribedBy, onPressRightIcon } =
    customProps
  const { value = '' } = nativeProps

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
          <Typo.Body>{label}</Typo.Body>
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
          ref={forwardedRef}
          onFocus={onFocus}
          onBlur={onBlur}
          autoCorrect={false}
          returnKeyType="search"
          selectionColor={ColorsEnum.GREY_DARK}
          aria-describedby={accessibilityDescribedBy}
          {...accessibilityAndTestId(accessibilityLabel, undefined)}
        />
        {value.length > 0 && (
          <RightIconContainer
            onPress={onPressRightIcon}
            {...accessibilityAndTestId(t`Réinitialiser la recherche`)}>
            <Invalidate color={ColorsEnum.GREY_DARK} />
          </RightIconContainer>
        )}
      </StyledInputContainer>
    </React.Fragment>
  )
}

export const SearchInput = forwardRef<RNTextInput, SearchInputProps>(WithRefSearchInput)

const RightIconContainer = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))({
  position: 'absolute',
  right: getSpacing(1),
  padding: getSpacing(2),
})
