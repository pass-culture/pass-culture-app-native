import React from 'react'
import { View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { LOCATION_PLACEHOLDER } from 'features/location/constants'
import { SuggestedPlaces } from 'features/search/pages/SuggestedPlacesOrVenues/SuggestedPlaces'
import { SuggestedPlace } from 'libs/place/types'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { useDebounceValue } from 'ui/hooks/useDebounceValue'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { getSpacing } from 'ui/theme'

interface LocationSearchInputProps {
  selectedPlace: SuggestedPlace | null
  setSelectedPlace: React.Dispatch<React.SetStateAction<SuggestedPlace | null>>
  placeQuery?: string
  setPlaceQuery: React.Dispatch<React.SetStateAction<string>>
  onResetPlace: () => void
  onSetSelectedPlace: (place: SuggestedPlace) => void
}

export const LocationSearchInput = ({
  selectedPlace,
  setSelectedPlace,
  placeQuery,
  setPlaceQuery,
  onResetPlace,
  onSetSelectedPlace,
}: LocationSearchInputProps) => {
  const { designSystem } = useTheme()
  const debouncedPlaceQuery = useDebounceValue(placeQuery, 500)

  const onChangePlace = (text: string) => {
    setSelectedPlace(null)
    setPlaceQuery(text)
  }

  const isQueryProvided = !!placeQuery && !!debouncedPlaceQuery
  const shouldShowSuggestedPlaces = isQueryProvided && !selectedPlace

  return (
    <StyledView>
      <SearchInput
        autoFocus
        LeftIcon={StyledMagnifyingGlass}
        inputHeight="regular"
        onChangeText={onChangePlace}
        onPressRightIcon={onResetPlace}
        placeholder={LOCATION_PLACEHOLDER}
        value={placeQuery}
        textStyle={selectedPlace ? designSystem.typography.button : designSystem.typography.body}
      />
      {shouldShowSuggestedPlaces ? (
        <StyledView>
          <SuggestedPlaces query={debouncedPlaceQuery} setSelectedPlace={onSetSelectedPlace} />
        </StyledView>
      ) : null}
    </StyledView>
  )
}

const StyledMagnifyingGlass = styled(MagnifyingGlass).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const StyledView = styled(View)({ paddingTop: getSpacing(4) })
