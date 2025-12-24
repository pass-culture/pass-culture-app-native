import React from 'react'
import styled from 'styled-components/native'

import { SuggestedPlaces } from 'features/search/pages/SuggestedPlacesOrVenues/SuggestedPlaces'
import { SuggestedPlace } from 'libs/place/types'
import { SearchInput } from 'ui/designSystem/SearchInput/SearchInput'
import { useDebounceValue } from 'ui/hooks/useDebounceValue'

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
        label="Recherche un ville, une adresse..."
        onChangeText={onChangePlace}
        onClear={onResetPlace}
        value={placeQuery}
      />
      {shouldShowSuggestedPlaces ? (
        <StyledView>
          <SuggestedPlaces query={debouncedPlaceQuery} setSelectedPlace={onSetSelectedPlace} />
        </StyledView>
      ) : null}
    </StyledView>
  )
}

const StyledView = styled.View(({ theme }) => ({
  marginTop: theme.designSystem.size.spacing.l,
}))
