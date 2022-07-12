import React, { FunctionComponent } from 'react'
import { NativeSyntheticEvent, TextInputSubmitEditingEventData } from 'react-native'
import styled from 'styled-components/native'

import { SearchInput } from 'ui/components/inputs/SearchInput'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'

type QueryProps = {
  query?: string
  setQuery: (text: string) => void
  onSubmitQuery: (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void
  resetQuery: () => void
}

type FocusProps = {
  isFocus?: boolean
  onFocusState?: (focus: boolean) => void
}

type LocationProps = {
  showLocationButton?: boolean
  locationLabel?: string
  onPressLocationButton: () => void
}

type Props = QueryProps &
  FocusProps &
  LocationProps & {
    searchInputID?: string
    children?: never
  }

export const SearchMainInput: FunctionComponent<Props> = ({
  query,
  setQuery,
  onSubmitQuery,
  resetQuery,
  isFocus = false,
  onFocusState,
  showLocationButton = false,
  locationLabel,
  onPressLocationButton,
  ...props
}) => (
  <SearchInput
    placeholder="Offre, artiste..."
    value={query}
    onChangeText={setQuery}
    onSubmitEditing={onSubmitQuery}
    onPressRightIcon={resetQuery}
    autoFocus={isFocus}
    onFocusState={onFocusState}
    nativeAutoFocus
    locationLabel={locationLabel}
    onPressLocationButton={showLocationButton ? onPressLocationButton : undefined}
    LeftIcon={MagnifyingGlassIcon}
    inputHeight="regular"
    testID="searchInput"
    {...props}
  />
)

const MagnifyingGlassIcon = styled(MagnifyingGlass).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
