import React, { FunctionComponent, useRef } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { Venue } from 'features/venue/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { useVenues } from 'libs/place'
import { plural } from 'libs/plural'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { Li } from 'ui/components/Li'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { VerticalUl } from 'ui/components/Ul'
import { useArrowNavigationForRadioButton } from 'ui/hooks/useArrowNavigationForRadioButton'
import { LocationBuildingFilled } from 'ui/svg/icons/LocationBuildingFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const keyExtractor = (hit: Venue) => {
  const { label, info } = hit
  const prefix = `venue-${hit.venueId}`

  return `${prefix}-${label}-${info}`
}

const MAXIMUM_RESULTS = 5

const Hit: React.FC<{ hit: Venue; onPress: () => void }> = ({ hit, onPress }) => {
  const containerRef = useRef(null)
  const { onFocus, onBlur } = useHandleFocus()
  useArrowNavigationForRadioButton(containerRef)

  const accessibilityLabel = `${hit.label} ${hit.info}`
  return (
    <TouchableOpacity
      accessibilityRole={AccessibilityRole.BUTTON}
      onFocus={onFocus}
      onBlur={onBlur}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}>
      <RefContainer ref={containerRef}>
        <BuildingIcon />
        <Spacer.Row numberOfSpaces={1} />
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
  setSelectedVenue: (venue: Venue) => void
}

export const SuggestedVenues: FunctionComponent<Props> = ({ query, setSelectedVenue }) => {
  const { data: venues = [], isLoading } = useVenues(query)

  const filteredPlaces: Venue[] = venues.slice(0, MAXIMUM_RESULTS)

  return (
    <React.Fragment>
      <NumberOfResults
        nbHits={filteredPlaces.length}
        show={filteredPlaces.length > 0 && !isLoading}
      />
      <View accessibilityRole={AccessibilityRole.STATUS}>
        <NoSuggestedPlacesOrVenues
          show={filteredPlaces.length === 0 && query.length > 0 && !isLoading}
        />
      </View>
      {filteredPlaces.length > 0 && (
        <VerticalUl>
          {filteredPlaces.map((item, index) => (
            <Li key={keyExtractor(item)}>
              <Hit hit={item} onPress={() => setSelectedVenue(item)} />
              {index + 1 < filteredPlaces.length && <Spacer.Column numberOfSpaces={4} />}
            </Li>
          ))}
        </VerticalUl>
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

const NoSuggestedPlacesOrVenues = ({ show }: { show: boolean }) =>
  show ? (
    <DescriptionErrorTextContainer>
      <StyledBody accessibilityLiveRegion="assertive">
        Aucun point de vente ne correspond à ta recherche
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

const BuildingIcon = styled(LocationBuildingFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
