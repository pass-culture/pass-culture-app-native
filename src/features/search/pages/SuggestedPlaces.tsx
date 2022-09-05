import { plural, t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import isEqual from 'lodash/isEqual'
import uniqWith from 'lodash/uniqWith'
import React, { useRef, useState } from 'react'
import { FlatList, View } from 'react-native'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { SuggestedPlace, usePlaces, useVenues } from 'libs/place'
import { SuggestedVenue } from 'libs/venue'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { useArrowNavigationForRadioButton } from 'ui/hooks/useArrowNavigationForRadioButton'
import { useSpaceBarAction } from 'ui/hooks/useSpaceBarAction'
import { BicolorLocationPointer as DefaultBicolorLocationPointer } from 'ui/svg/icons/BicolorLocationPointer'
import { LocationBuilding as DefaultLocationBuilding } from 'ui/svg/icons/LocationBuilding'
import { getSpacing, Spacer, Typo } from 'ui/theme'

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
  const containerRef = useRef(null)
  const [isFocus, setIsFocus] = useState(false)
  useArrowNavigationForRadioButton(containerRef)
  useSpaceBarAction(isFocus ? onPress : undefined)

  return (
    <ItemContainer
      accessibilityRole={AccessibilityRole.RADIO}
      onFocus={() => setIsFocus(true)}
      onBlur={() => setIsFocus(false)}
      onPress={onPress}
      testID={keyExtractor(hit)}>
      <RefContainer ref={containerRef}>
        <Icon />
        <Spacer.Row numberOfSpaces={4} />
        <Text>
          <Typo.ButtonText>{hit.label}</Typo.ButtonText>
          <Spacer.Row numberOfSpaces={1} />
          <Typo.Body>{hit.info}</Typo.Body>
        </Text>
      </RefContainer>
    </ItemContainer>
  )
}

export const SuggestedPlaces: React.FC<{ query: string; accessibilityLabelledBy?: string }> = ({
  query,
  accessibilityLabelledBy,
}) => {
  const { data: places = [], isLoading: isLoadingPlaces } = usePlaces({ query })
  const { data: venues = [], isLoading: isLoadingVenues } = useVenues(query)
  const { navigate } = useNavigation<UseNavigationType>()

  const onPickPlace = (hit: SuggestedPlaceOrVenue) => () => {
    if (isVenue(hit) && hit.venueId) {
      navigate('LocationFilter', { selectedVenue: hit })
    } else if (isPlace(hit) && hit.geolocation) {
      navigate('LocationFilter', { selectedPlace: hit })
    }
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
      <View accessibilityRole={AccessibilityRole.STATUS}>
        <NoSuggestedPlaces show={filteredPlaces.length === 0 && query.length > 0 && !isLoading} />
      </View>
      <FlatList
        accessibilityRole={AccessibilityRole.RADIOGROUP}
        data={filteredPlaces}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => <Hit hit={item} onPress={onPickPlace(item)} />}
        ItemSeparatorComponent={Separator}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        aria-labelledby={accessibilityLabelledBy}
      />
    </React.Fragment>
  )
}

const NumberOfResults = ({ nbHits, show }: { nbHits: number; show: boolean }) => {
  const numberOfResults = plural(nbHits, {
    one: '# résultat',
    other: '# résultats',
  })

  return (
    <HiddenAccessibleText accessibilityRole={AccessibilityRole.STATUS}>
      {show ? numberOfResults : ''}
    </HiddenAccessibleText>
  )
}

const NoSuggestedPlaces = ({ show }: { show: boolean }) =>
  show ? (
    <DescriptionErrorTextContainer>
      <DescriptionErrorText aria-live="assertive">{t`Aucun lieu ne correspond à ta recherche`}</DescriptionErrorText>
    </DescriptionErrorTextContainer>
  ) : (
    <React.Fragment />
  )

const ItemContainer = styled(TouchableOpacity)({
  marginHorizontal: getSpacing(6),
  paddingVertical: getSpacing(4),
})

const RefContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const Text = styled.Text.attrs({
  numberOfLines: 2,
})(({ theme }) => ({
  color: theme.colors.black,
  flex: 1,
}))

const Separator = styled.View(({ theme }) => ({
  height: 2,
  backgroundColor: theme.colors.greyLight,
  marginHorizontal: getSpacing(6),
}))

const DescriptionErrorTextContainer = styled(Typo.Body)({
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
