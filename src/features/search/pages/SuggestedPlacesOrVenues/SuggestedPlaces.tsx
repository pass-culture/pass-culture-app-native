import { isEqual, uniqWith } from 'lodash'
import React, { FunctionComponent } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { HiddenAccessibleResultNumber } from 'features/search/pages/SuggestedPlacesOrVenues/HiddenAccessibleResultNumber'
import { SuggestedResult } from 'features/search/pages/SuggestedPlacesOrVenues/SuggestedResult'
import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { SuggestedPlace } from 'libs/place/types'
import { MIN_QUERY_LENGTH, usePlaces } from 'libs/place/usePlaces'
import { Li } from 'ui/components/Li'
import { Spinner } from 'ui/components/Spinner'
import { VerticalUl } from 'ui/components/Ul'
import { LocationPointer as DefaultLocationPointer } from 'ui/svg/icons/LocationPointer'
import { Spacer, Typo } from 'ui/theme'

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
    return <Spinner testID="loader" />
  }

  const isQueryProvided = query.length > 0
  const isQueryTooShort = query.length < MIN_QUERY_LENGTH

  const filteredPlaces: SuggestedPlace[] = [...uniqWith(places.slice(0, MAXIMUM_RESULTS), isEqual)]
  const hasResults = filteredPlaces.length > 0

  return (
    <React.Fragment>
      <HiddenAccessibleResultNumber nbResults={filteredPlaces.length} show={hasResults} />
      <View accessibilityRole={AccessibilityRole.STATUS}>
        <NoSuggestedPlaces show={!hasResults && !isQueryTooShort && isQueryProvided} />
        <NotLongEnough show={isQueryTooShort} />
      </View>
      {hasResults ? (
        <VerticalUl>
          {filteredPlaces.map((item, index) => (
            <Li key={keyExtractor(item)}>
              <SuggestedResult
                label={item.label}
                info={item.info}
                Icon={Icon}
                onPress={() => setSelectedPlace(item)}
              />
              {index + 1 < filteredPlaces.length ? <Spacer.Column numberOfSpaces={4} /> : null}
            </Li>
          ))}
        </VerticalUl>
      ) : null}
    </React.Fragment>
  )
}

const NoSuggestedPlaces = ({ show }: { show: boolean }) =>
  show ? (
    <StyledBody accessibilityLiveRegion="assertive">
      Aucune localisation ne correspond à ta recherche
    </StyledBody>
  ) : null

const NotLongEnough = ({ show }: { show: boolean }) =>
  show ? (
    <StyledBody accessibilityLiveRegion="assertive">
      Ta recherche doit comporter au minimum 3 caractères pour afficher des résultats
    </StyledBody>
  ) : null

const ListIconWrapper = styled.View(({ theme }) => ({
  marginRight: theme.designSystem.size.spacing.xxs,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))

const ListLocationPointer = styled(DefaultLocationPointer).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
  color: theme.designSystem.color.icon.subtle,
}))``
