import isEqual from 'lodash/isEqual'
import uniqWith from 'lodash/uniqWith'
import React, { FunctionComponent, useRef } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { Venue } from 'features/venue/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { SuggestedPlace, usePlaces, useVenues } from 'libs/place'
import { plural } from 'libs/plural'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { Li } from 'ui/components/Li'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { VerticalUl } from 'ui/components/Ul'
import { useArrowNavigationForRadioButton } from 'ui/hooks/useArrowNavigationForRadioButton'
import { useSpaceBarAction } from 'ui/hooks/useSpaceBarAction'
import { LocationBuilding as DefaultLocationBuilding } from 'ui/svg/icons/LocationBuilding'
import { LocationPointerNotFilled as DefaultLocationPointerNotFilled } from 'ui/svg/icons/LocationPointerNotFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'

type SuggestedPlaceOrVenue = SuggestedPlace | Venue

const isPlace = (hit: SuggestedPlaceOrVenue): hit is SuggestedPlace => !('venueId' in hit)
const isVenue = (hit: SuggestedPlaceOrVenue): hit is Venue => 'venueId' in hit

export const keyExtractor = (hit: SuggestedPlaceOrVenue) => {
  const { label, info } = hit
  const prefix = isVenue(hit) ? `venue-${hit.venueId}` : 'place'
  const suffix =
    isPlace(hit) && hit.geolocation
      ? `${hit.geolocation.latitude}-${hit.geolocation.longitude}`
      : 'no-geolocation'

  return `${prefix}-${label}-${info}-${suffix}`
}

const MAXIMUM_RESULTS = 5

const Hit: React.FC<{ hit: SuggestedPlaceOrVenue; onPress: () => void }> = ({ hit, onPress }) => {
  const Icon = isVenue(hit) ? () => <LocationBuilding /> : () => <BicolorLocationPointer />
  const containerRef = useRef(null)
  const { onFocus, onBlur, isFocus } = useHandleFocus()
  useArrowNavigationForRadioButton(containerRef)
  useSpaceBarAction(isFocus ? onPress : undefined)

  const accessibilityLabel = `${hit.label} ${hit.info}`
  return (
    <TouchableOpacity
      accessibilityRole={AccessibilityRole.RADIO}
      onFocus={onFocus}
      onBlur={onBlur}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}>
      <RefContainer ref={containerRef}>
        <Icon />
        <Spacer.Row numberOfSpaces={4} />
        <Text>
          <Typo.ButtonText>{hit.label}</Typo.ButtonText>
          <Spacer.Row numberOfSpaces={1} />
          <Typo.Body>{hit.info}</Typo.Body>
        </Text>
      </RefContainer>
    </TouchableOpacity>
  )
}

type Props = {
  query: string
  setSelectedPlaceOrVenue: (placeOrVenue: SuggestedPlace | Venue) => void
}

export const SuggestedPlaces: FunctionComponent<Props> = ({ query, setSelectedPlaceOrVenue }) => {
  const { data: places = [], isLoading: isLoadingPlaces } = usePlaces({ query })
  const { data: venues = [], isLoading: isLoadingVenues } = useVenues(query)

  const filteredPlaces: SuggestedPlaceOrVenue[] = [
    ...venues.slice(0, MAXIMUM_RESULTS),
    ...uniqWith(places.slice(0, MAXIMUM_RESULTS), isEqual),
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
      {filteredPlaces.length > 0 && (
        <React.Fragment>
          {/*<Spacer.Column numberOfSpaces={6} />*/}
          <VerticalUl>
            {filteredPlaces.map((item, index) => (
              <Li key={keyExtractor(item)}>
                <Hit hit={item} onPress={() => setSelectedPlaceOrVenue(item)} />
                {index + 1 < filteredPlaces.length && <Spacer.Column numberOfSpaces={4} />}
              </Li>
            ))}
          </VerticalUl>
        </React.Fragment>
      )}
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
      <StyledBody accessibilityLiveRegion="assertive">
        Aucun lieu ne correspond à ta recherche
      </StyledBody>
    </DescriptionErrorTextContainer>
  ) : (
    <React.Fragment />
  )

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

const DescriptionErrorTextContainer = styled(Typo.Body)({
  marginTop: getSpacing(6),
  textAlign: 'center',
})

const StyledBody = styled(Typo.Body)(({ theme }) => ({ color: theme.colors.greyDark }))

const LocationBuilding = styled(DefaultLocationBuilding).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

const BicolorLocationPointer = styled(DefaultLocationPointerNotFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``
