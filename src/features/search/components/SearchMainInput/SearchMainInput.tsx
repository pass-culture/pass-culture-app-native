import React, { forwardRef } from 'react'
import {
  NativeSyntheticEvent,
  Platform,
  TextInput as RNTextInput,
  TextInputSubmitEditingEventData,
} from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { LocationSearchWidget } from 'features/location/components/LocationSearchWidget'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'

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
    ...props
  }: Props,
  ref
) {
  const { isDesktopViewport } = useTheme()

  const renderSearchChildren = () => {
    return !showLocationButton || isDesktopViewport ? null : <LocationSearchWidget />
  }
  return (
    <StyledSearchInput
      ref={ref}
      placeholder="Offre, artiste, lieu culturel..."
      value={query}
      onChangeText={setQuery}
      onSubmitEditing={onSubmitQuery}
      onPressRightIcon={resetQuery}
      nativeAutoFocus={Platform.OS !== 'web'}
      autoFocus={isFocus}
      onFocus={onFocus}
      LeftIcon={MagnifyingGlassIcon}
      inputHeight="regular"
      testID="searchInput"
      disableClearButton={disableInputClearButton}
      {...props}>
      {renderSearchChildren()}
    </StyledSearchInput>
  )
})

const StyledSearchInput = styled(SearchInput).attrs({
  inputContainerStyle: {
    flex: 1,
  },
})({})

const MagnifyingGlassIcon = styled(MagnifyingGlass).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
