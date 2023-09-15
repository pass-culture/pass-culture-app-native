import isEqual from 'lodash/isEqual'
import uniqWith from 'lodash/uniqWith'
import React, { FunctionComponent, useRef } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { AccessibilityRole } from 'libs/accessibilityRole/accessibilityRole'
import { useHandleFocus } from 'libs/hooks/useHandleFocus'
import { SuggestedPlace, usePlaces } from 'libs/place'
import { plural } from 'libs/plural'
import { HiddenAccessibleText } from 'ui/components/HiddenAccessibleText'
import { Li } from 'ui/components/Li'
import { TouchableOpacity } from 'ui/components/TouchableOpacity'
import { VerticalUl } from 'ui/components/Ul'
import { useArrowNavigationForRadioButton } from 'ui/hooks/useArrowNavigationForRadioButton'
import { LocationPointer as DefaultLocationPointer } from 'ui/svg/icons/LocationPointer'
import { Spacer, Typo, getSpacing } from 'ui/theme'

const keyExtractor = (hit: SuggestedPlace) => {
  const { label, info } = hit
  const prefix = 'place'
  const suffix = hit.geolocation
    ? `${hit.geolocation.latitude}-${hit.geolocation.longitude}`
    : 'no-geolocation'

  return `${prefix}-${label}-${info}-${suffix}`
}

const MAXIMUM_RESULTS = 5

const Icon = () => (
  <ListIconWrapper>
    <ListLocationPointer />
  </ListIconWrapper>
)

const Hit: React.FC<{ hit: SuggestedPlace; onPress: () => void }> = ({ hit, onPress }) => {
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
        <Icon />
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
  setSelectedPlace: (place: SuggestedPlace) => void
}

export const SuggestedPlaces: FunctionComponent<Props> = ({ query, setSelectedPlace }) => {
  const { data: places = [], isLoading } = usePlaces({ query })

  const filteredPlaces: SuggestedPlace[] = [...uniqWith(places.slice(0, MAXIMUM_RESULTS), isEqual)]

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
          <VerticalUl>
            {filteredPlaces.map((item, index) => (
              <Li key={keyExtractor(item)}>
                <Hit hit={item} onPress={() => setSelectedPlace(item)} />
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
