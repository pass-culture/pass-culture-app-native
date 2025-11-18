import React, { forwardRef } from 'react'
import {
  NativeSyntheticEvent,
  Platform,
  TextInput as RNTextInput,
  TextInputSubmitEditingEventData,
} from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { LocationSearchWidget } from 'features/location/components/LocationSearchWidget'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { SearchInput as SearchInputLegacy } from 'ui/components/inputs/SearchInput'
import { SearchInput } from 'ui/designSystem/SearchInput/SearchInput'
import { Search } from 'ui/svg/icons/Search'

type QueryProps = {
  query?: string
  setQuery: (text: string) => void
  onSubmitQuery: (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void
  resetQuery: () => void
}

type FocusProps = {
  isFocusable?: boolean
  isFocus?: boolean
  onFocus?: () => void
  disableInputClearButton: boolean
}

type Props = QueryProps &
  FocusProps & {
    searchInputID?: string
    accessibilityDescribedBy?: string
    children?: never
    showLocationButton?: boolean
    placeholder?: string
  }

export const SearchMainInput = forwardRef<RNTextInput, Props>(function SearchMainInput(
  {
    query,
    setQuery,
    onSubmitQuery,
    resetQuery,
    isFocus = false,
    onFocus,
    showLocationButton = false,
    disableInputClearButton,
    placeholder = 'Offre, artiste, lieu culturel...',
    isFocusable,
    ...props
  }: Props,
  ref
) {
  const { isDesktopViewport } = useTheme()
  const {
    data: { displayNewSearchHeader },
  } = useRemoteConfigQuery()

  const renderSearchChildren = () => {
    const hideLocationSearchWidget =
      !!displayNewSearchHeader || !showLocationButton || isDesktopViewport
    return hideLocationSearchWidget ? null : <LocationSearchWidget />
  }
  return displayNewSearchHeader ? (
    <SearchInput
      label="Recherche par offre, lieu, artiste"
      ref={ref}
      value={query}
      onChangeText={setQuery}
      onSubmitEditing={onSubmitQuery}
      onClear={resetQuery}
      nativeAutoFocus={Platform.OS !== 'web'}
      onFocus={onFocus}
      focusable={isFocusable}
      testID="searchInput"
      disableClearButton={disableInputClearButton}
    />
  ) : (
    <StyledSearchInput
      ref={ref}
      placeholder={placeholder}
      value={query}
      onChangeText={setQuery}
      onSubmitEditing={onSubmitQuery}
      onPressRightIcon={resetQuery}
      nativeAutoFocus={Platform.OS !== 'web'}
      autoFocus={isFocus}
      onFocus={onFocus}
      LeftIcon={SearchIcon}
      inputHeight="regular"
      testID="searchInput"
      disableClearButton={disableInputClearButton}
      isFocusable={isFocusable}
      {...props}>
      {renderSearchChildren()}
    </StyledSearchInput>
  )
})

const StyledSearchInput = styled(SearchInputLegacy).attrs({
  inputContainerStyle: {
    flex: 1,
  },
})({})

const SearchIcon = styled(Search).attrs(({ theme }) => ({
  color: theme.designSystem.color.icon.subtle,
  size: theme.icons.sizes.smaller,
}))``
