import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { forwardRef, useCallback, useState } from 'react'
import { TextInput as RNTextInput } from 'react-native'
import styled from 'styled-components/native'
import { v4 as uuidv4 } from 'uuid'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useLocationChoice } from 'features/search/components/locationChoice.utils'
import { LocationType } from 'features/search/enums'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
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
  } = customProps
  const { value = '' } = nativeProps
  const searchInputID = props.searchInputID ?? uuidv4()
  const { navigate } = useNavigation<UseNavigationType>()
  const { searchState } = useStagedSearch()
  const { locationFilter } = searchState
  const { locationType } = locationFilter
  // PLACE and VENUE belong to the same section
  const section = locationType === LocationType.VENUE ? LocationType.PLACE : locationType
  const { label: locationLabel } = useLocationChoice(section)

  function onFocus() {
    setIsFocus(true)
    if (props?.onFocusState) props.onFocusState(true)
  }

  function onBlur() {
    setIsFocus(false)
    if (props?.onFocusState) props.onFocusState(false)
  }

  const onPressLocationButton = useCallback(() => {
    navigate('LocationFilter')
  }, [navigate])

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
        {LeftIcon ? (
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
        {props.showLocationButton ? (
          <StyledButtonPrimary
            testID="locationButton"
            wording={locationLabel}
            onPress={onPressLocationButton}
            icon={LocationPointer}
            textSize={getSpacing(3)}
            buttonHeight="extraSmall"
            ellipsizeMode="tail"
            maxWidth={getSpacing(23)}
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

const StyledButtonPrimary = styledButton(ButtonPrimary)({
  maxWidth: getSpacing(34),
})
