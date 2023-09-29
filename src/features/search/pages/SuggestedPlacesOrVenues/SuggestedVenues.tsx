import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { HiddenAccessibleResultNumber } from 'features/search/pages/SuggestedPlacesOrVenues/HiddenAccessibleResultNumber'
import { SuggestedResult } from 'features/search/pages/SuggestedPlacesOrVenues/SuggestedResult'
import { Venue } from 'features/venue/types'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useVenues } from 'libs/place'
import { Li } from 'ui/components/Li'
import { Spinner } from 'ui/components/Spinner'
import { VerticalUl } from 'ui/components/Ul'
import { LocationBuildingFilled } from 'ui/svg/icons/LocationBuildingFilled'
import { getSpacing, Spacer, Typo } from 'ui/theme'

const keyExtractor = (venue: Venue) => {
  const { label, info } = venue
  const prefix = `venue-${venue.venueId}`

  return `${prefix}-${label}-${info}`
}

const MAXIMUM_RESULTS = 5

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
          {filteredVenues.map((item, index) => {
            const isLast = index === filteredVenues.length - 1
            return (
              <Li key={keyExtractor(item)}>
                <SuggestedResult
                  label={item.label}
                  info={item.info}
                  Icon={BuildingIcon}
                  onPress={() => setSelectedVenue(item)}
                />
                {!isLast && <Spacer.Column numberOfSpaces={4} />}
              </Li>
            )
          })}
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

const DescriptionErrorTextContainer = styled(Typo.Body)({
  marginTop: getSpacing(6),
  textAlign: 'center',
})

const StyledBody = styled(Typo.Body)(({ theme }) => ({ color: theme.colors.greyDark }))

const BuildingIcon = styled(LocationBuildingFilled).attrs(({ theme }) => ({
  size: theme.icons.sizes.smaller,
}))``
