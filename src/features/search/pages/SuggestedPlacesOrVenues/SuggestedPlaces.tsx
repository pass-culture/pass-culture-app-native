import isEqual from 'lodash/isEqual'
import uniqWith from 'lodash/uniqWith'
import React, { FunctionComponent, useRef } from 'react'
import { Platform, View } from 'react-native'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { SuggestedPlace, usePlaces } from 'libs/place'
import { plural } from 'libs/plural'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { Li } from 'ui/components/Li'
import { Spinner } from 'ui/components/Spinner'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { VerticalUl } from 'ui/components/Ul'
import { useArrowNavigationForRadioButton } from 'ui/hooks/useArrowNavigationForRadioButton'
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

const PlaceResult: React.FC<{ place: SuggestedPlace; onPress: () => void }> = ({
  place,
  onPress,
}) => {
  const containerRef = useRef(null)
  const { onFocus, onBlur } = useHandleFocus()
  useArrowNavigationForRadioButton(containerRef)

  const accessibilityLabel = `${place.label} ${place.info}`
  return (
    <TouchableOpacity
      // so that the user can press it without dismissing the keyboard
      {...Platform.select({ default: { shouldUseGestureHandler: true }, web: undefined })}
      accessibilityRole={AccessibilityRole.BUTTON}
      onFocus={onFocus}
      onBlur={onBlur}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}>
      <RefContainer ref={containerRef}>
        <Icon />
        <Spacer.Row numberOfSpaces={1} />
        <Text>
          <Typo.ButtonText>{place.label}</Typo.ButtonText>
          <Spacer.Row numberOfSpaces={1} />
          <Typo.Body>{place.info}</Typo.Body>
        </Text>
      </RefContainer>
    </TouchableOpacity>
  )
}

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
                <PlaceResult place={item} onPress={() => setSelectedPlace(item)} />
                {index + 1 < filteredPlaces.length && <Spacer.Column numberOfSpaces={4} />}
              </Li>
            ))}
          </VerticalUl>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

const HiddenAccessibleResultNumber = ({
  nbResults,
  show,
}: {
  nbResults: number
  show: boolean
}) => {
  const numberOfResults = plural(nbResults, {
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
    <StyledBody accessibilityLiveRegion="assertive">
      Aucune localisation ne correspond à ta recherche
    </StyledBody>
  ) : (
    <React.Fragment />
  )

const RefContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'flex-start',
})

const ListIconWrapper = styled.View(({ theme }) => ({
  marginTop: (theme.typography.body.fontSize * 15) / 100,
  marginRight: getSpacing(0.5),
}))

const Text = styled.Text.attrs({
  numberOfLines: 2,
})(({ theme }) => ({
  color: theme.colors.black,
  flex: 1,
}))

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const ListLocationPointer = styled(DefaultLocationPointer).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``
