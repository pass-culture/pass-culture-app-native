import React from 'react'
import styled from 'styled-components/native'

import { SuggestedPlaces } from 'features/search/pages/SuggestedPlacesOrVenues/SuggestedPlaces'
import { SuggestedPlace } from 'libs/place'
import { theme } from 'theme'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { useDebounceValue } from 'ui/hooks/useDebounceValue'
import { MagnifyingGlass } from 'ui/svg/icons/MagnifyingGlass'
import { Spacer } from 'ui/theme'

interface LocationSearchInputProps {
  selectedPlace: SuggestedPlace | null
  setSelectedPlace: React.Dispatch<React.SetStateAction<SuggestedPlace | null>>
  placeQuery?: string
  setPlaceQuery: React.Dispatch<React.SetStateAction<string>>
  onResetPlace: () => void
  onSetSelectedPlace: (place: SuggestedPlace) => void
}

const LOCATION_PLACEHOLDER = 'Ville, code postal, adresse'

export const LocationSearchInput = ({
  selectedPlace,
  setSelectedPlace,
  placeQuery,
  setPlaceQuery,
  onResetPlace,
  onSetSelectedPlace,
}: LocationSearchInputProps) => {
  const debouncedPlaceQuery = useDebounceValue(placeQuery, 500)

  const onChangePlace = (text: string) => {
    setSelectedPlace(null)
    setPlaceQuery(text)
  }

  const isQueryProvided = !!placeQuery && !!debouncedPlaceQuery
  const shouldShowSuggestedPlaces = isQueryProvided && !selectedPlace

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={4} />
      <SearchInput
        autoFocus
        LeftIcon={StyledMagnifyingGlass}
        inputHeight="regular"
        onChangeText={onChangePlace}
        onPressRightIcon={onResetPlace}
        placeholder={LOCATION_PLACEHOLDER}
        value={placeQuery}
        textStyle={selectedPlace ? theme.typography.buttonText : theme.typography.body}
      />
      {shouldShowSuggestedPlaces ? (
        <React.Fragment>
          <Spacer.Column numberOfSpaces={4} />
          <SuggestedPlaces query={debouncedPlaceQuery} setSelectedPlace={onSetSelectedPlace} />
        </React.Fragment>
      ) : null}
    </React.Fragment>
  )
}

const StyledMagnifyingGlass = styled(MagnifyingGlass).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``
