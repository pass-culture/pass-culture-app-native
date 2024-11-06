import React, { forwardRef } from 'react'
import {
  NativeSyntheticEvent,
  Platform,
  TextInput as RNTextInput,
  TextInputSubmitEditingEventData,
} from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { LocationSearchWidget } from 'features/location/components/LocationSearchWidget'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { BicolorSearchV2 } from 'ui/svg/icons/BicolorSearchV2'
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
    ...props
  }: Props,
  ref
) {
  const { isDesktopViewport } = useTheme()
  const shouldUseV2Icon = useFeatureFlag(RemoteStoreFeatureFlags.WIP_APP_V2_TAB_BAR)

  const renderSearchChildren = () => {
    const showLocationSearchWidget = showLocationButton || !isDesktopViewport
    return showLocationSearchWidget ? <LocationSearchWidget /> : null
  }
  return (
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
      LeftIcon={shouldUseV2Icon ? SearchIcon : MagnifyingGlassIcon}
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

const SearchIcon = styled(BicolorSearchV2).attrs(({ theme }) => ({
  color: theme.colors.greyDark,
  size: theme.icons.sizes.smaller,
}))``
