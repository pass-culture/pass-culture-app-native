import { t } from '@lingui/macro'
import React, { forwardRef, useRef, useState } from 'react'
import { Platform, TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { styledButton } from 'ui/components/buttons/styledButton'
import { InputLabel } from 'ui/components/InputLabel/InputLabel'
import { Touchable } from 'ui/components/touchable/Touchable'
import { Invalidate as DefaultInvalidate } from 'ui/svg/icons/Invalidate'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
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
    onPressLocationButton,
    locationLabel,
  } = customProps
  const { value = '' } = nativeProps
  const searchInputID = props.searchInputID ?? uuidv4()
  const searchInput = useRef<RNTextInput>(null)

  const shouldShowLocationButton = !!onPressLocationButton

  function onFocus() {
    setIsFocus(true)
    if (props?.onFocusState) props.onFocusState(true)
  }

  function onBlur() {
    if (props.value === '' && Platform.OS === 'web') {
      searchInput.current?.focus()
      return
    }
    setIsFocus(false)
    if (props?.onFocusState) props.onFocusState(false)
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
        focusOutlineColor={focusOutlineColor}
        shouldShowLocationButton={shouldShowLocationButton}>
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
          selectionColor={undefined}
          aria-describedby={accessibilityDescribedBy}
          enablesReturnKeyAutomatically={true}
          {...accessibilityAndTestId(accessibilityLabel, label ? undefined : 'searchInput')}
        />
        {shouldShowLocationButton ? (
          <LocationButton
            testID="locationButton"
            wording={locationLabel || ''}
            onPress={onPressLocationButton}
            icon={LocationPointer}
            buttonHeight="extraSmall"
            ellipsizeMode="tail"
          />
        ) : null}
        {value.length > 0 && (
          <RightIconContainer
            onPress={onPressRightIcon}
            {...accessibilityAndTestId(t`Réinitialiser la recherche`, 'resetSearchInput')}
            type="reset">
            <Invalidate />
          </RightIconContainer>
        )}
      </StyledInputContainer>
    </React.Fragment>
  )
}

export const SearchInput = forwardRef<RNTextInput, SearchInputProps>(WithRefSearchInput)

const LeftIconContainer = styled.View({ flexShrink: 0 })

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

const StyledInputContainer = styled(InputContainer)(
  ({ shouldShowLocationButton }: { shouldShowLocationButton: boolean }) => ({
    outlineOffset: 0,
    borderRadius: getSpacing(6),
    ...(shouldShowLocationButton ? { paddingRight: getSpacing(2) } : {}),
  })
)

const LocationButton = styledButton(ButtonPrimary)({
  // max width corresponds to the size of "Autour de moi" state.
  maxWidth: 142,
})
