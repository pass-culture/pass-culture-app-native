import React, { FunctionComponent, useRef } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { HiddenAccessibleResultNumber } from 'features/search/pages/SuggestedPlacesOrVenues/HiddenAccessibleResultNumber'
import { Venue } from 'features/venue/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { useVenues } from 'libs/place'
import { Li } from 'ui/components/Li'
import { Spinner } from 'ui/components/Spinner'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { VerticalUl } from 'ui/components/Ul'
import { useArrowNavigationForRadioButton } from 'ui/hooks/useArrowNavigationForRadioButton'
import { LocationBuildingFilled } from 'ui/svg/icons/LocationBuildingFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const keyExtractor = (venue: Venue) => {
  const { label, info } = venue
  const prefix = `venue-${venue.venueId}`

  return `${prefix}-${label}-${info}`
}

const MAXIMUM_RESULTS = 5

const VenueResult: React.FC<{ venue: Venue; onPress: () => void }> = ({ venue, onPress }) => {
  const containerRef = useRef(null)
  const { onFocus, onBlur } = useHandleFocus()
  useArrowNavigationForRadioButton(containerRef)

  const accessibilityLabel = `${venue.label} ${venue.info}`
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
          <Typo.ButtonText>{venue.label}</Typo.ButtonText>
          <Spacer.Row numberOfSpaces={1} />
          <Typo.Body>{venue.info}</Typo.Body>
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

  if (isLoading) {
    return <Spinner />
  }

  const isQueryProvided = query.length > 0

  const filteredVenues: Venue[] = venues.slice(0, MAXIMUM_RESULTS)
  const hasResults = filteredVenues.length > 0

  return (
    <React.Fragment>
      <HiddenAccessibleResultNumber nbResults={filteredVenues.length} show={hasResults} />
      <View accessibilityRole={AccessibilityRole.STATUS}>
        <NoSuggestedVenues show={!hasResults && isQueryProvided} />
      </View>
      {!!hasResults && (
        <VerticalUl>
          {filteredVenues.map((item, index) => (
            <Li key={keyExtractor(item)}>
              <VenueResult venue={item} onPress={() => setSelectedVenue(item)} />
              {index + 1 < filteredVenues.length && <Spacer.Column numberOfSpaces={4} />}
            </Li>
          ))}
        </VerticalUl>
      )}
    </React.Fragment>
  )
}

const NoSuggestedVenues = ({ show }: { show: boolean }) =>
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
