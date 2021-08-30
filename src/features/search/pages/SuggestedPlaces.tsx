import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import isEqual from 'lodash.isequal'
import uniqWith from 'lodash.uniqwith'
import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { usePlaces } from 'features/search/api/usePlaces'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SuggestedPlace } from 'libs/place'
import { BicolorLocationPointer } from 'ui/svg/icons/BicolorLocationPointer'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY, ColorsEnum } from 'ui/theme/colors'

export const keyExtractor = (place: SuggestedPlace) => {
  const { label, info, geolocation } = place
  return geolocation ? `${geolocation.latitude}-${geolocation.longitude}` : `${label}-${info}`
}

const PlaceHit: React.FC<{ place: SuggestedPlace; onPress: () => void }> = ({ place, onPress }) => (
  <ItemContainer onPress={onPress} testID={keyExtractor(place)}>
    <BicolorLocationPointer size={getSpacing(10)} color2={ColorsEnum.PRIMARY} />
    <Spacer.Row numberOfSpaces={2} />
    <Text numberOfLines={2}>
      <Typo.ButtonText>{place.label}</Typo.ButtonText>
      <Spacer.Row numberOfSpaces={1} />
      <Typo.Body>{place.info}</Typo.Body>
    </Text>
  </ItemContainer>
)

export const SuggestedPlaces: React.FC<{ query: string }> = ({ query }) => {
  const { data: places = [], isLoading } = usePlaces(query)
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

const Text = styled.Text({ flex: 1 })

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
