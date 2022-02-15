import { plural, t } from '@lingui/macro'
import isEqual from 'lodash.isequal'
import uniqWith from 'lodash.uniqwith'
import React from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useGoBack } from 'features/navigation/useGoBack'
import { MAX_RADIUS } from 'features/search/pages/reducer.helpers'
import { useStagedSearch } from 'features/search/pages/SearchWrapper'
import { analytics } from 'libs/analytics'
import { SuggestedPlace, usePlaces, useVenues } from 'libs/place'
import { SuggestedVenue } from 'libs/venue'
import { AriaLive } from 'ui/components/AriaLive'
import { BicolorLocationPointer as DefaultBicolorLocationPointer } from 'ui/svg/icons/BicolorLocationPointer'
import { LocationBuilding as DefaultLocationBuilding } from 'ui/svg/icons/LocationBuilding'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { Li } from 'ui/web/list/Li'
import { Ul } from 'ui/web/list/Ul'

type SuggestedPlaceOrVenue = SuggestedPlace | SuggestedVenue

const isPlace = (hit: SuggestedPlaceOrVenue): hit is SuggestedPlace => !('venueId' in hit)
const isVenue = (hit: SuggestedPlaceOrVenue): hit is SuggestedVenue => 'venueId' in hit

export const keyExtractor = (hit: SuggestedPlaceOrVenue) => {
  const { label, info } = hit
  const prefix = isVenue(hit) ? `venue-${hit.venueId}` : 'place'
  const suffix =
    isPlace(hit) && hit.geolocation
      ? `${hit.geolocation.latitude}-${hit.geolocation.longitude}`
      : 'no-geolocation'

  return `${prefix}-${label}-${info}-${suffix}`
}

const Hit: React.FC<{ hit: SuggestedPlaceOrVenue; onPress: () => void }> = ({ hit, onPress }) => {
  const Icon = isVenue(hit) ? () => <LocationBuilding /> : () => <BicolorLocationPointer />

  return (
    <ItemContainer onPress={onPress} testID={keyExtractor(hit)}>
      <Icon />
      <Spacer.Row numberOfSpaces={4} />
      <Text numberOfLines={2}>
        <Typo.ButtonText>{hit.label}</Typo.ButtonText>
        <Spacer.Row numberOfSpaces={1} />
        <Typo.Body>{hit.info}</Typo.Body>
      </Text>
    </ItemContainer>
  )
}

export const SuggestedPlaces: React.FC<{ query: string }> = ({ query }) => {
  const { data: places = [], isLoading: isLoadingPlaces } = usePlaces({ query })
  const { data: venues = [], isLoading: isLoadingVenues } = useVenues(query)
  const { dispatch } = useStagedSearch()
  const { goBack } = useGoBack(...getTabNavConfig('Search'))

  const onPickPlace = (hit: SuggestedPlaceOrVenue) => () => {
    if (isVenue(hit) && hit.venueId) {
      analytics.logChooseLocation({ type: 'venue', venueId: hit.venueId })
      dispatch({ type: 'SET_LOCATION_VENUE', payload: hit })
    } else if (isPlace(hit) && hit.geolocation) {
      analytics.logChooseLocation({ type: 'place' })
      dispatch({ type: 'SET_LOCATION_PLACE', payload: { aroundRadius: MAX_RADIUS, place: hit } })
    }
    // we need to call goBack twice, first to LocationPicker
    goBack()
    // then previous page
    goBack()
  }

  const filteredPlaces: SuggestedPlaceOrVenue[] = [
    ...venues.slice(0, 5),
    ...uniqWith(places, isEqual),
  ]
  const isLoading = isLoadingPlaces || isLoadingVenues

  return (
    <React.Fragment>
      <NumberOfResults
        nbHits={filteredPlaces.length}
        show={filteredPlaces.length > 0 && !isLoading}
      />
      <Ul>
        <FlatList
          data={filteredPlaces}
          keyExtractor={keyExtractor}
          renderItem={({ item }) => <Hit hit={item} onPress={onPickPlace(item)} />}
          CellRendererComponent={Li}
          ListEmptyComponent={() => <NoSuggestedPlaces show={query.length > 0 && !isLoading} />}
          ItemSeparatorComponent={Separator}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        />
      </Ul>
    </React.Fragment>
  )
}

const NumberOfResults = ({ nbHits, show }: { nbHits: number; show: boolean }) => {
  const numberOfResults = plural(nbHits, {
    one: '# résultat',
    other: '# résultats',
  })

  return <AriaLive liveType="assertive">{show ? numberOfResults : ''}</AriaLive>
}

const NoSuggestedPlaces = ({ show }: { show: boolean }) =>
  show ? (
    <DescriptionErrorTextContainer>
      <DescriptionErrorText aria-live="assertive">{t`Aucun lieu ne correspond à ta recherche`}</DescriptionErrorText>
    </DescriptionErrorTextContainer>
  ) : (
    <React.Fragment />
  )

const ItemContainer = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))({
  flexDirection: 'row',
  marginHorizontal: getSpacing(6),
  paddingVertical: getSpacing(4),
  alignItems: 'center',
})

const Text = styled.Text({ flex: 1 })

const Separator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.colors.greyLight,
  marginHorizontal: getSpacing(6),
}))

const DescriptionErrorTextContainer = styled.Text({
  marginTop: getSpacing(6.5),
  textAlign: 'center',
})

const DescriptionErrorText = styled(Typo.Body)(({ theme }) => ({ color: theme.colors.greyDark }))

const LocationBuilding = styled(DefaultLocationBuilding).attrs(({ theme }) => ({
  color: theme.colors.primary,
}))``

const BicolorLocationPointer = styled(DefaultBicolorLocationPointer).attrs(({ theme }) => ({
  color2: theme.colors.primary,
}))``
