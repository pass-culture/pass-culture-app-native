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
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { styledButton } from 'ui/components/buttons/styledButton'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { LocationPointer } from 'ui/svg/icons/LocationPointer'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { getSpacing } from 'ui/theme'

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
}

type LocationProps = {
  showLocationButton?: boolean
  locationLabel?: string
  numberOfLinesForLocation: number
  onPressLocationButton: () => void
}

type Props = QueryProps &
  FocusProps &
  LocationProps & {
    searchInputID?: string
    accessibilityDescribedBy?: string
    children?: never
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
    locationLabel,
    onPressLocationButton,
    numberOfLinesForLocation,
    ...props
  }: Props,
  ref
) {
  const { isDesktopViewport } = useTheme()
  const enableAppLocation = useFeatureFlag(RemoteStoreFeatureFlags.WIP_ENABLE_APP_LOCATION)

  const renderSearchChildren = () => {
    if (!showLocationButton) return null
    if (enableAppLocation) {
      return isDesktopViewport ? null : <LocationSearchWidget />
    }
    return (
      <LocationButton
        wording={locationLabel ?? ''}
        onPress={onPressLocationButton}
        icon={LocationPointer}
        buttonHeight="extraSmall"
        ellipsizeMode="tail"
        numberOfLines={numberOfLinesForLocation}
      />
    )
  }
  return (
    <StyledSearchInput
      ref={ref}
      placeholder="Offre, artiste, point de vente..."
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

const LocationButton = styledButton(ButtonPrimary)({
  maxWidth: 142, // max width corresponds to the size of "Autour de moi" state.
  marginLeft: getSpacing(2),
  marginRight: -getSpacing(2),
})
