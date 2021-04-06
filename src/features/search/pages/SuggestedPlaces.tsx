import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import isEqual from 'lodash.isequal'
import uniqWith from 'lodash.uniqwith'
import React from 'react'
import { FlatList, Text } from 'react-native'
import styled from 'styled-components/native'

import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { REGEX_STARTING_WITH_NUMBERS, SuggestedPlace } from 'libs/place'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY, ColorsEnum } from 'ui/theme/colors'

export const keyExtractor = ({ geolocation, name }: SuggestedPlace) => {
  if (geolocation) return `${geolocation.latitude}-${geolocation.longitude}`
  return `${name.short}-${name.long}`
}

const PlaceHit: React.FC<{ place: SuggestedPlace; onPress: () => void }> = ({ place, onPress }) => {
  const placeNameStartsWithNumbers = REGEX_STARTING_WITH_NUMBERS.test(place.name.short)

  return (
    <ItemContainer onPress={onPress} testID={keyExtractor(place)}>
      <Text numberOfLines={2}>
        <Typo.ButtonText>
          {placeNameStartsWithNumbers ? place.name.short : place.name.long}
        </Typo.ButtonText>
        <Spacer.Row numberOfSpaces={1} />
        <Typo.Body>
          {placeNameStartsWithNumbers ? place.extraData.city : place.extraData.department}
        </Typo.Body>
      </Text>
    </ItemContainer>
  )
}

interface Props {
  places: SuggestedPlace[]
  query: string
  isLoading: boolean
}

export const SuggestedPlaces: React.FC<Props> = ({ places, query, isLoading }) => {
  const { goBack } = useNavigation()
  const { dispatch } = useStagedSearch()

  const onPickPlace = (place: SuggestedPlace) => () => {
    if (place.geolocation) {
      dispatch({ type: 'LOCATION_PLACE', payload: place })
    }
    // We go straight to Search page (we skip the Location page)
    goBack()
    goBack()
  }

  const filteredPlaces = uniqWith(places, isEqual)

  return (
    <FlatList
      data={filteredPlaces}
      keyExtractor={keyExtractor}
      renderItem={({ item: place }) => <PlaceHit place={place} onPress={onPickPlace(place)} />}
      ListEmptyComponent={() => <NoSuggestedPlaces show={query.length > 0 && !isLoading} />}
      ItemSeparatorComponent={Separator}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    />
  )
}

const NoSuggestedPlaces = ({ show }: { show: boolean }) =>
  show ? (
    <DescriptionErrorTextContainer>
      <DescriptionErrorText>{t`Aucun lieu ne correspond à ta recherche`}</DescriptionErrorText>
    </DescriptionErrorTextContainer>
  ) : (
    <React.Fragment />
  )

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

const DescriptionErrorTextContainer = styled.Text({
  marginTop: getSpacing(6.5),
  textAlign: 'center',
})

const DescriptionErrorText = styled(Typo.Body)({ color: ColorsEnum.GREY_DARK })
