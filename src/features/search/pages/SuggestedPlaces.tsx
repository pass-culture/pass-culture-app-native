import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import isEqual from 'lodash.isequal'
import uniqWith from 'lodash.uniqwith'
import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useGoBack } from 'features/navigation/useGoBack'
import { usePlaces, useVenues } from 'features/search/api'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { SuggestedPlace } from 'libs/place'
import { BicolorLocationPointer } from 'ui/svg/icons/BicolorLocationPointer'
import { LocationBuilding } from 'ui/svg/icons/LocationBuilding'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { ACTIVE_OPACITY, ColorsEnum } from 'ui/theme/colors'

export const keyExtractor = (hit: SuggestedPlace) => {
  const { label, info, geolocation, venueId } = hit
  return geolocation
    ? `${venueId}-${label}-${info}-${geolocation.latitude}-${geolocation.longitude}`
    : `${venueId}-${label}-${info}`
}

const Hit: React.FC<{ hit: SuggestedPlace; onPress: () => void }> = ({ hit, onPress }) => {
  const Icon = !hit.venueId
    ? () => <BicolorLocationPointer size={getSpacing(10)} color2={ColorsEnum.PRIMARY} />
    : () => <LocationBuilding size={getSpacing(10)} color={ColorsEnum.PRIMARY} />

  return (
    <ItemContainer onPress={onPress} testID={keyExtractor(hit)}>
      <Icon />
      <Spacer.Row numberOfSpaces={2} />
      <Text numberOfLines={2}>
        <Typo.ButtonText>{hit.label}</Typo.ButtonText>
        <Spacer.Row numberOfSpaces={1} />
        <Typo.Body>{hit.info}</Typo.Body>
      </Text>
    </ItemContainer>
  )
}

export const SuggestedPlaces: React.FC<{
  query: string
  from?: 'filters' | 'search'
}> = ({ query, from }) => {
  const { data: places = [], isLoading: isLoadingPlaces } = usePlaces(query)
  const { data: venues = [], isLoading: isLoadingVenues } = useVenues(query)
  const { dispatch } = useStagedSearch()
  const { goBack } = useGoBack('Search')
  const { navigate } = useNavigation<UseNavigationType>()

  const onPickPlace = (place: SuggestedPlace) => () => {
    const { venueId, ...payload } = place
    if (venueId) {
      dispatch({ type: 'LOCATION_VENUE', payload: place })
    } else if (place.geolocation) {
      dispatch({ type: 'LOCATION_PLACE', payload })
    }
    if (!from) {
      goBack()
    } else {
      navigate(from === 'filters' ? 'SearchFilter' : 'Search')
    }
  }

  const filteredPlaces = [...venues.slice(0, 5), ...uniqWith(places, isEqual)]
  const isLoading = isLoadingPlaces || isLoadingVenues

  return (
    <FlatList
      data={filteredPlaces}
      keyExtractor={keyExtractor}
      renderItem={({ item }) => <Hit hit={item} onPress={onPickPlace(item)} />}
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
