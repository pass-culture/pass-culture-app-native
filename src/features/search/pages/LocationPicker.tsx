import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import debounce from 'lodash.debounce'
import React, { useEffect, useRef, useState } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import styled from 'styled-components/native'

import { useSearch } from 'features/search/pages/SearchWrapper'
import { _ } from 'libs/i18n'
import { fetchPlaces, REGEX_STARTING_WITH_NUMBERS, SuggestedPlace } from 'libs/place'
import { PageHeader } from 'ui/components/headers/PageHeader'
import { SearchInput } from 'ui/components/inputs/SearchInput'
import { Invalidate } from 'ui/svg/icons/Invalidate'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY, ColorsEnum } from 'ui/theme/colors'

const SEARCH_DEBOUNCE_MS = 500

const RightIcon: React.FC<{ value: string; onPress: () => void }> = (props) =>
  props.value.length > 0 ? (
    <TouchableOpacity activeOpacity={ACTIVE_OPACITY} onPress={props.onPress}>
      <Invalidate size={24} />
    </TouchableOpacity>
  ) : null

export const keyExtractor = ({ geolocation, name }: SuggestedPlace) => {
  if (geolocation) return `${geolocation.latitude}-${geolocation.longitude}`
  return `${name.short}-${name.long}`
}

const PlaceHit: React.FC<{ place: SuggestedPlace; onPress: () => void }> = ({ place, onPress }) => (
  <ItemContainer onPress={onPress} testID={keyExtractor(place)}>
    <Typo.ButtonText>{place.name.short}</Typo.ButtonText>
    <Spacer.Row numberOfSpaces={1} />
    <Typo.Body>
      {REGEX_STARTING_WITH_NUMBERS.test(place.name.short)
        ? place.extraData.city
        : place.extraData.department}
    </Typo.Body>
  </ItemContainer>
)

export const LocationPicker: React.FC = () => {
  const [places, setPlaces] = useState<SuggestedPlace[]>([])
  const [value, setValue] = useState<string>('')
  const [debouncedValue, setDebouncedValue] = useState<string>(value)
  const debouncedSetValue = useRef(debounce(setDebouncedValue, SEARCH_DEBOUNCE_MS)).current

  useEffect(() => {
    if (debouncedValue.length > 0) fetchPlaces({ query: debouncedValue }).then(setPlaces)
  }, [debouncedValue])

  const resetSearch = () => {
    setValue('')
    setDebouncedValue('')
  }

  const onChangeText = (newValue: string) => {
    setValue(newValue)
    debouncedSetValue(newValue)
  }

  return (
    <React.Fragment>
      <Spacer.TopScreen />
      <Spacer.Column numberOfSpaces={18} />
      <StyledInput>
        <SearchInput
          value={value}
          onChangeText={onChangeText}
          placeholder={_(t`Choisir un lieu...`)}
          autoFocus={true}
          inputHeight="tall"
          RightIcon={() => <RightIcon value={value} onPress={resetSearch} />}
        />
      </StyledInput>
      <Spacer.Column numberOfSpaces={4} />
      <SuggestedPlaces places={places} />
      <PageHeader title={_(t`Choisir un lieu`)} />
    </React.Fragment>
  )
}

export const SuggestedPlaces: React.FC<{ places: SuggestedPlace[] }> = ({ places }) => {
  const { goBack } = useNavigation()
  const { dispatch } = useSearch()

  const onPickPlace = (place: SuggestedPlace) => () => {
    if (place.geolocation) {
      dispatch({ type: 'LOCATION_PLACE', payload: place })
    }
    goBack()
  }

  return (
    <FlatList
      data={places}
      keyExtractor={keyExtractor}
      renderItem={({ item: place }) => <PlaceHit place={place} onPress={onPickPlace(place)} />}
      ListEmptyComponent={React.Fragment}
      ItemSeparatorComponent={Separator}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    />
  )
}

const StyledInput = styled.View({ alignItems: 'center' })
const ItemContainer = styled.TouchableOpacity.attrs({
  activeOpacity: ACTIVE_OPACITY,
})({
  flexDirection: 'row',
  marginHorizontal: getSpacing(6),
  paddingVertical: getSpacing(4),
  alignItems: 'center',
})
const Separator = styled.View({
  height: 2,
  backgroundColor: ColorsEnum.GREY_LIGHT,
  marginHorizontal: getSpacing(6),
})
