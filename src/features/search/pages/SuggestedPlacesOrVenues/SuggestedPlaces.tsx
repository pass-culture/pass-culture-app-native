import isEqual from 'lodash/isEqual'
import uniqWith from 'lodash/uniqWith'
import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { HiddenAccessibleResultNumber } from 'features/search/pages/SuggestedPlacesOrVenues/HiddenAccessibleResultNumber'
import { SuggestedResult } from 'features/search/pages/SuggestedPlacesOrVenues/SuggestedResult'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { SuggestedPlace, usePlaces } from 'libs/place'
import { Li } from 'ui/components/Li'
import { Spinner } from 'ui/components/Spinner'
import { VerticalUl } from 'ui/components/Ul'
import { LocationPointer as DefaultLocationPointer } from 'ui/svg/icons/LocationPointer'
import { Spacer, Typo, getSpacing } from 'ui/theme'

const keyExtractor = (place: SuggestedPlace) => {
  const { label, info } = place
  const prefix = 'place'
  const suffix = place.geolocation
    ? `${place.geolocation.latitude}-${place.geolocation.longitude}`
    : 'no-geolocation'

  return `${prefix}-${label}-${info}-${suffix}`
}

const MAXIMUM_RESULTS = 5

const Icon = () => (
  <ListIconWrapper>
    <ListLocationPointer />
  </ListIconWrapper>
)

type Props = {
  query: string
  setSelectedPlace: (place: SuggestedPlace) => void
}

export const SuggestedPlaces: FunctionComponent<Props> = ({ query, setSelectedPlace }) => {
  const { data: places = [], isLoading } = usePlaces({ query })

  if (isLoading) {
    return <Spinner />
  }

  const isQueryProvided = query.length > 0

  const filteredPlaces: SuggestedPlace[] = [...uniqWith(places.slice(0, MAXIMUM_RESULTS), isEqual)]
  const hasResults = filteredPlaces.length > 0

  return (
    <React.Fragment>
      <HiddenAccessibleResultNumber nbResults={filteredPlaces.length} show={hasResults} />
      <View accessibilityRole={AccessibilityRole.STATUS}>
        <NoSuggestedPlaces show={!hasResults && isQueryProvided} />
      </View>
      {!!hasResults && (
        <React.Fragment>
          <VerticalUl>
            {filteredPlaces.map((item, index) => (
              <Li key={keyExtractor(item)}>
                <SuggestedResult
                  label={item.label}
                  info={item.info}
                  Icon={Icon}
                  onPress={() => setSelectedPlace(item)}
                />
                {index + 1 < filteredPlaces.length && <Spacer.Column numberOfSpaces={4} />}
              </Li>
            ))}
          </VerticalUl>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

const NoSuggestedPlaces = ({ show }: { show: boolean }) =>
  show ? (
    <StyledBody accessibilityLiveRegion="assertive">
      Aucune localisation ne correspond à ta recherche
    </StyledBody>
  ) : (
    <React.Fragment />
  )

const ListIconWrapper = styled.View(({ theme }) => ({
  marginTop: (theme.typography.body.fontSize * 15) / 100,
  marginRight: getSpacing(0.5),
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const ListLocationPointer = styled(DefaultLocationPointer).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``
